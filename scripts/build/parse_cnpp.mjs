#!/usr/bin/env node
// Parses CNPP plain-text versions (extracted from Cámara de Diputados .doc
// files via catdoc) into a structured JSON dataset with reform history.
//
// Expected input: a directory of .txt files where filename convention is
// arbitrary; the authoritative date is read from the document header
// ("Última reforma publicada DOF DD-MM-YYYY"). The script picks the
// newest version as the "vigente" master and emits older versions as
// reform snapshots per article.
//
// Output: public/data/cnpp.json

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SOURCE_DIR = process.argv[2] || '/tmp/cnpp_txt';
const FALLBACK_DIR = process.argv[3] && !process.argv[3].endsWith('.json') ? process.argv[3] : (process.env.CNPP_FALLBACK_DIR || '/tmp/cnpp_txt_aw');
const OUT_FILE = (process.argv[3] && process.argv[3].endsWith('.json')) ? process.argv[3] : (process.argv[4] || path.resolve('public/data/cnpp.json'));

const SOURCE_URL = 'https://www.diputados.gob.mx/LeyesBiblio/ref/cnpp.htm';
const PDF_URL = 'https://www.diputados.gob.mx/LeyesBiblio/pdf/CNPP.pdf';

function readVersion(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const header = raw.slice(0, 4000);
  const m = header.match(/Última reforma publicada DOF\s+(\d{2})-(\d{2})-(\d{4})/);
  if (!m) {
    // Possibly "publicado el 5 de marzo de 2014" original
    const pub = header.match(/publicado en el Diario Oficial de la Federación el\s+(\d+)\s+de\s+([a-zñáéíóú]+)\s+de\s+(\d{4})/i);
    if (pub) {
      const months = { enero:'01', febrero:'02', marzo:'03', abril:'04', mayo:'05', junio:'06',
        julio:'07', agosto:'08', septiembre:'09', octubre:'10', noviembre:'11', diciembre:'12' };
      const mm = months[pub[2].toLowerCase()];
      if (mm) return { iso: `${pub[3]}-${mm}-${String(pub[1]).padStart(2,'0')}`, raw };
    }
    throw new Error(`No date header in ${filePath}`);
  }
  return { iso: `${m[3]}-${m[2]}-${m[1]}`, raw };
}

function normWS(s) { return s.replace(/\s+/g, ' ').trim(); }

function parseVersion(raw) {
  const lines = raw.split(/\r?\n/);
  const articles = new Map();
  let book = '', title = '', chapter = '', section = '';
  let current = null;
  let titleMode = false;
  let titleBuf = '';
  let bodyBuf = [];

  function flush() {
    if (current) {
      const cleanText = bodyBuf.join('\n')
        .replace(/[ \t]{2,}/g, ' ')           // antiword justification spaces
        .replace(/\n[ \t]+/g, '\n')           // leading spaces per line
        .replace(/\n{3,}/g, '\n\n')           // collapse blank runs
        .trim();
      articles.set(current.id, {
        ...current,
        heading: normWS(titleBuf),
        text: cleanText,
      });
    }
  }

  // Capture a section heading that may span: "LIBRO PRIMERO" then blank then "DISPOSICIONES GENERALES" then blank then "TÍTULO I" then blank then "DISPOSICIONES PRELIMINARES" ... We grab the rubric + the next non-blank line as descriptive name, up to 4 lines, stopping at any other rubric or first Artículo.
  function captureSection(i, kind) {
    const startLine = lines[i].trim();
    const parts = [startLine];
    let j = i + 1;
    let nonBlankCaptured = 0;
    const rubricsOther = ['LIBRO', 'TÍTULO', 'CAPÍTULO', 'SECCIÓN'].filter(r => r !== kind);
    while (j < lines.length && nonBlankCaptured < 2) {
      const tj = lines[j].trim();
      if (tj === '') { j++; continue; }
      // Stop on any other rubric or article
      if (rubricsOther.some(r => new RegExp('^' + r + '\\s').test(tj)) ||
          /^Artículo\s/.test(tj) ||
          new RegExp('^' + kind + '\\s').test(tj)) break;
      parts.push(tj);
      nonBlankCaptured++;
      j++;
      // Heading may itself wrap one line
      while (j < lines.length && lines[j].trim() && nonBlankCaptured < 2) {
        const tn = lines[j].trim();
        if (rubricsOther.some(r => new RegExp('^' + r + '\\s').test(tn)) ||
            /^Artículo\s/.test(tn) ||
            new RegExp('^' + kind + '\\s').test(tn)) break;
        parts.push(tn);
        nonBlankCaptured++;
        j++;
      }
    }
    return { value: normWS(parts.join(' ')), nextIndex: j - 1 };
  }

  // Stop processing after the article body — TRANSITORIOS section starts
  let stopped = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (/^TRANSITORIOS$/i.test(t) || /^Transitorios$/.test(t)) {
      stopped = true;
      flush();
      current = null;
      break;
    }

    if (/^LIBRO\s/i.test(t)) {
      flush(); current = null;
      const r = captureSection(i, 'LIBRO');
      book = r.value; title = ''; chapter = ''; section = '';
      i = r.nextIndex; continue;
    }
    if (/^TÍTULO\s/i.test(t)) {
      flush(); current = null;
      const r = captureSection(i, 'TÍTULO');
      title = r.value; chapter = ''; section = '';
      i = r.nextIndex; continue;
    }
    if (/^CAPÍTULO\s/i.test(t)) {
      flush(); current = null;
      const r = captureSection(i, 'CAPÍTULO');
      chapter = r.value; section = '';
      i = r.nextIndex; continue;
    }
    if (/^SECCIÓN\s/i.test(t)) {
      flush(); current = null;
      const r = captureSection(i, 'SECCIÓN');
      section = r.value;
      i = r.nextIndex; continue;
    }

    const am = t.match(/^Artículo\s+(\d+)(o\.?)?\.\s+(.*)$/);
    if (am) {
      flush();
      const num = parseInt(am[1], 10);
      const ord = am[2] ? (am[2].endsWith('.') ? am[2] : am[2] + '.') : '.';
      current = {
        id: String(num),
        number: num,
        label: `Artículo ${num}${ord === '.' ? '' : ord.replace('.', '')}`,
        book, title, chapter, section,
      };
      titleBuf = am[3];
      bodyBuf = [];
      titleMode = true;
      continue;
    }

    if (!current) continue;
    if (titleMode) {
      if (t === '') { titleMode = false; continue; }
      // Heading wraps in some converters (catdoc) but not in others (antiword).
      // Accept a continuation line into the heading only if it is short and
      // doesn't look like a body sentence. Otherwise the line is body.
      const looksLikeBody = t.length > 60 || /[.;:]$/.test(t) || /^(El|La|Los|Las|Se|En|Cuando|Para|Toda|Todo|Si|No)\s/i.test(t);
      const titleAlreadyHasTwoLines = (titleBuf.match(/\s/g) || []).length > 18;
      if (looksLikeBody || titleAlreadyHasTwoLines) {
        titleMode = false;
        bodyBuf.push(line);
      } else {
        titleBuf += ' ' + t;
      }
    } else {
      bodyBuf.push(line);
    }
  }
  if (!stopped) flush();
  return articles;
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
}

function loadParsedFromDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt')).map(f => path.join(dir, f));
  return files.map(f => {
    const v = readVersion(f);
    return { file: f, iso: v.iso, parsed: parseVersion(v.raw) };
  });
}

function main() {
  const primary = loadParsedFromDir(SOURCE_DIR);
  if (!primary.length) {
    console.error(`No .txt files in ${SOURCE_DIR}`);
    process.exit(1);
  }
  const fallback = loadParsedFromDir(FALLBACK_DIR);
  const fallbackByIso = new Map(fallback.map(v => [v.iso, v.parsed]));

  // Patch primary articles when body is empty/too short by falling back to the
  // alternate converter. Both must agree on article number for the patch.
  let patched = 0;
  for (const v of primary) {
    const alt = fallbackByIso.get(v.iso);
    if (!alt) continue;
    for (const [id, a] of v.parsed) {
      if (!a.text || a.text.trim().length < 30) {
        const altA = alt.get(id);
        if (altA && altA.text && altA.text.trim().length > 30) {
          v.parsed.set(id, { ...a, text: altA.text, heading: a.heading || altA.heading });
          patched++;
        }
      }
    }
  }
  if (patched) console.log(`Patched ${patched} artículo(s) usando conversión alternativa (${FALLBACK_DIR}).`);

  const versions = primary.sort((a, b) => a.iso.localeCompare(b.iso));

  const master = versions[versions.length - 1];
  console.log(`Master version: DOF ${master.iso} (${master.parsed.size} artículos)`);

  // Build articles with reform history
  const out = [];
  for (const [id, art] of master.parsed) {
    const history = [];
    // Walk older versions newest-to-oldest, capture text snapshots when text differs
    let lastTextNorm = normWS(art.text);
    for (let v = versions.length - 2; v >= 0; v--) {
      const older = versions[v].parsed.get(id);
      if (!older) {
        history.push({
          dof: versions[v].iso,
          status: 'no_existia',
          heading: null,
          text: null,
        });
        break;
      }
      const olderNorm = normWS(older.text);
      if (olderNorm !== lastTextNorm) {
        history.push({
          dof: versions[v].iso,
          status: 'redaccion_anterior',
          heading: older.heading,
          text: older.text,
        });
        lastTextNorm = olderNorm;
      }
    }

    out.push({
      ...art,
      history,
      source_url: SOURCE_URL,
      source_label: `Cámara de Diputados — CNPP, última reforma DOF ${master.iso}`,
      checksum: sha256(art.text),
    });
  }

  // Articles in older versions but not in master (derogados)
  const repealed = [];
  const masterIds = new Set([...master.parsed.keys()]);
  for (let v = versions.length - 2; v >= 0; v--) {
    for (const [id, art] of versions[v].parsed) {
      if (!masterIds.has(id) && !repealed.find(r => r.id === id)) {
        repealed.push({
          ...art,
          repealed_known_since: versions[v + 1] ? versions[v + 1].iso : master.iso,
          last_seen_version: versions[v].iso,
          source_url: SOURCE_URL,
          source_label: `Cámara de Diputados — versión histórica DOF ${versions[v].iso}`,
        });
      }
    }
  }

  const dataset = {
    metadata: {
      schema_version: 1,
      vigente_dof: master.iso,
      generated_at: new Date().toISOString(),
      source_html: SOURCE_URL,
      source_pdf: PDF_URL,
      versions_processed: versions.map(v => v.iso),
      article_count: out.length,
      repealed_count: repealed.length,
    },
    articles: out.sort((a, b) => a.number - b.number),
    repealed,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(dataset, null, 2));
  console.log(`Wrote ${OUT_FILE}`);
  console.log(`  ${out.length} artículos vigentes`);
  console.log(`  ${repealed.length} artículos derogados detectados`);
  const withHistory = out.filter(a => a.history.length).length;
  console.log(`  ${withHistory} artículos con historial de reforma`);
}

main();
