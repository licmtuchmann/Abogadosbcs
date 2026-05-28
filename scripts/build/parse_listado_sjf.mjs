#!/usr/bin/env node
// Parses the SJF weekly listing PDF ("Listado de Tesis") and emits a
// normalized JSON array of placeholder entries with rubro and metadata.
//
// The PDF lives at https://sjfsemanal.scjn.gob.mx/listado-resultado-tesis
// and uses a 5-column tabular layout. We convert with pdftotext -layout
// and parse by detecting row headers ("<idx> <registro> <numero>").
//
// Output: a JSON array on stdout, or write to file via --out <path>.
//
// Usage:
//   node scripts/build/parse_listado_sjf.mjs /tmp/listado.txt
//   node scripts/build/parse_listado_sjf.mjs /tmp/listado.txt --out /tmp/listado.json

import fs from 'node:fs';
import path from 'node:path';

const IN = process.argv[2];
if (!IN) {
  console.error('Usage: parse_listado_sjf.mjs <listado.txt> [--out <path>]');
  process.exit(1);
}
const outIdx = process.argv.indexOf('--out');
const OUT = outIdx > -1 ? process.argv[outIdx + 1] : null;

const txt = fs.readFileSync(IN, 'utf8');
const lines = txt.split(/\r?\n/);

// Row header pattern:
//   "  1   2032166    P./J. 89/2026 (12a.)   INCUMPLIMIENTO ..."
// Detect via leading idx + 7-digit registro + tesis number form.
const ROW_RE = /^\s*(\d+)\s+(\d{7,8})\s+(.+)$/;
// Patterns for tesis numbers (covers Pleno, Salas, Plenos Regionales, Plenos de Circuito, TCC).
// PR format is "PR.A.C.CS. J/4 C (12a.)" — dot-separated codes + slash + num + optional materia letter + época.
const TESIS_NUM_RE = new RegExp([
  // Plenos Regionales: PR.A.C.CS. J/4 C (12a.) — capture trailing single materia letter
  '^PR\\.[A-Z.]+\\s+J?\\/?\\d+(?:\\s+[A-Z])?(?:\\s*\\([^)]+\\))?',
  // Plenos de Circuito: PC.I.P. J/61 P (10a.)
  '^PC\\.[A-Z.]+\\s+J?\\/?\\d+(?:\\s+[A-Z])?(?:\\s*\\([^)]+\\))?',
  // Tribunal Colegiado: I.5o.P.51 P (10a.) or XXVII.3o.37 P (10a.)
  '^[IVX]+\\.[0-9A-Za-z.°]+\\s+[A-Z](?:\\s*\\([^)]+\\))?',
  // Pleno: P./J. 89/2026 (12a.) or P. II/2026 (12a.)
  '^P\\.\\/J\\.\\s+\\d+\\/\\d+(?:\\s*\\([^)]+\\))?',
  '^P\\.\\s+[IVX]+\\/\\d+(?:\\s*\\([^)]+\\))?',
  // Salas: 1a./J. 9/2021 (11a.) or 1a. XVIII/2025 (11a.)
  '^[12]a\\.\\/J\\.\\s+\\d+\\/\\d+(?:\\s*\\([^)]+\\))?',
  '^[12]a\\.\\s+[IVX]+\\/\\d+(?:\\s*\\([^)]+\\))?',
].join('|'));

// Split a layout line into rubro + nota by detecting big internal whitespace.
// The rubro column ends around char 110, nota begins after. Heuristic: split
// at the first 2+ whitespace gap that appears after column ~50.
function splitRubroNota(line) {
  // Pattern-based splits first (highest priority, capture year wraps).
  // The PDF column-wraps "viernes 22 de mayo de\n2026 a las 10:27 horas" so we
  // need to detect "<year> a las" or "<year> ESN" patterns and put them in nota.
  const yearAnchor = line.match(/(\d{4})\s+(?:a las|hor|aplicación|lunes)/);
  if (yearAnchor && yearAnchor.index > 30) {
    return { rubro: line.slice(0, yearAnchor.index).trim(), nota: line.slice(yearAnchor.index).trim() };
  }
  const anchors = ['Esta tesis se publicó', 'Esta ejecutoria', 'aplicación obligatoria',
                   'a las 10:', 'en el Semanario', 'Acuerdo General Plenario',
                   'viernes ', 'lunes ', 'martes ', 'efectos previstos', 'punto octavo',
                   'punto séptimo', 'punto noveno', 'considera de', 'partir del'];
  for (const a of anchors) {
    const idx = line.indexOf(a);
    if (idx > 30) return { rubro: line.slice(0, idx).trim(), nota: line.slice(idx).trim() };
  }
  // Fallback: largest gap of 3+ spaces
  const m = line.match(/^(.+?)\s{3,}(.+)$/);
  if (m && m[1].length > 30) return { rubro: m[1].trim(), nota: m[2].trim() };
  return { rubro: line.trim(), nota: '' };
}

function deriveTipo(numero) {
  // Plenos Regionales use J/<num> for jurisprudencia even though they start with PR.
  if (/^PR\./.test(numero)) return { tipo: /J\//.test(numero) ? 'Jurisprudencia' : 'Tesis aislada', organo: 'Plenos Regionales' };
  if (/^P\.\/J\./.test(numero)) return { tipo: 'Jurisprudencia', organo: 'Pleno' };
  if (/^P\./.test(numero) && !/\/J/.test(numero)) return { tipo: 'Tesis aislada', organo: 'Pleno' };
  if (/^1a\.\/J\./.test(numero)) return { tipo: 'Jurisprudencia', organo: 'Primera Sala' };
  if (/^1a\./.test(numero)) return { tipo: 'Tesis aislada', organo: 'Primera Sala' };
  if (/^2a\.\/J\./.test(numero)) return { tipo: 'Jurisprudencia', organo: 'Segunda Sala' };
  if (/^2a\./.test(numero)) return { tipo: 'Tesis aislada', organo: 'Segunda Sala' };
  if (/^PC\./.test(numero)) return { tipo: /J\//.test(numero) ? 'Jurisprudencia' : 'Tesis aislada', organo: 'Pleno de Circuito' };
  if (/^[IVX]+\./.test(numero)) return { tipo: /J\//.test(numero) ? 'Jurisprudencia' : 'Tesis aislada', organo: 'Tribunal Colegiado de Circuito' };
  return { tipo: 'Tesis', organo: 'SCJN' };
}

function deriveEpoca(numero) {
  const m = numero.match(/\(([\dIVX]+a?\.)\)/);
  if (!m) return null;
  const code = m[1];
  const map = {
    '12a.': 'Duodécima Época', '11a.': 'Undécima Época', '10a.': 'Décima Época',
    '9a.': 'Novena Época', '8a.': 'Octava Época',
  };
  return map[code] || code;
}

function parseFechaPublicacion(nota) {
  if (!nota) return null;
  // The year may be wrapped to a separate column in the PDF, so use a loose
  // pattern that allows whitespace/any chars between the month name and the year.
  const m = nota.match(/viernes\s+(\d+)\s+de\s+([a-zñ]+)\s+de[\s\S]{0,40}?(\d{4})/i);
  if (!m) return null;
  const months = { enero:'01', febrero:'02', marzo:'03', abril:'04', mayo:'05', junio:'06',
    julio:'07', agosto:'08', septiembre:'09', octubre:'10', noviembre:'11', diciembre:'12' };
  const mm = months[m[2].toLowerCase()];
  if (!mm) return null;
  return `${m[3]}-${mm}-${String(m[1]).padStart(2,'0')}`;
}

// Walk lines: when ROW_RE matches and the third group starts with a tesis
// number pattern, open a new entry. Accumulate following indented lines into
// rubro/nota until the next row or until 30 lines (safety cap).
const entries = [];
let cur = null;

function commit() {
  if (!cur) return;
  cur.rubro = cur.rubro.replace(/\s+/g, ' ').trim();
  // Collapse letter-spaced text artifacts (pdftotext renders justified caps as
  // "E S N E C E S A R I O") into joined uppercase strings. The result is
  // not perfectly word-broken — the Friday hydrator fetches the canonical
  // rubro from the detail page. Mark as partial.
  const before = cur.rubro;
  cur.rubro = cur.rubro.replace(/(?:\b[A-ZÁÉÍÓÚÜÑ]\s){3,}[A-ZÁÉÍÓÚÜÑ]\b/g, (m) => m.replace(/\s/g, ''));
  // Detect leftover artifacts (very long uppercase runs that look concatenated)
  cur.rubro_partial = before !== cur.rubro || /[A-ZÁÉÍÓÚÜÑ]{20,}/.test(cur.rubro);
  cur.nota = cur.nota.replace(/\s+/g, ' ').trim();
  cur.fecha_publicacion = parseFechaPublicacion(cur.nota);
  entries.push(cur);
  cur = null;
}

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(ROW_RE);
  if (m) {
    const rest = m[3];
    const numMatch = rest.match(TESIS_NUM_RE);
    if (numMatch) {
      commit();
      let numero = numMatch[0].trim();
      const after = rest.slice(numMatch[0].length).trim();
      // Handle multi-line tesis numbers (PR.A.C.CS. J/4 C wraps to "(12a.)")
      const epocaMissing = !/\([^)]+\)$/.test(numero);
      const meta = deriveTipo(numero);
      cur = {
        registro: m[2],
        numero,
        organo: meta.organo,
        tipo: meta.tipo,
        epoca: deriveEpoca(numero),
        rubro: '',
        nota: '',
        source_url: `https://sjf2.scjn.gob.mx/detalle/tesis/${m[2]}`,
        _epoca_missing: epocaMissing,
      };
      if (after) {
        const sp = splitRubroNota(after);
        cur.rubro = sp.rubro;
        cur.nota = sp.nota;
      }
      continue;
    }
  }
  if (cur && lines[i].trim()) {
    // If época was on a wrapped line (e.g. row has PR.A.C.CS. J/4 C and the
    // next continuation line starts with "(12a.)"), absorb that into numero.
    if (cur._epoca_missing) {
      const epocaCont = lines[i].match(/^\s+\((\d{1,2}a\.)\)/);
      if (epocaCont) {
        cur.numero += ' (' + epocaCont[1] + ')';
        cur.epoca = deriveEpoca(cur.numero);
        cur._epoca_missing = false;
        // The rest of the line (after the closing paren of epoca) is rubro/nota
        const after = lines[i].slice(epocaCont[0].length);
        if (after.trim()) {
          const sp = splitRubroNota(after);
          cur.rubro += ' ' + sp.rubro;
          cur.nota += ' ' + sp.nota;
        }
        continue;
      }
    }
    const sp = splitRubroNota(lines[i]);
    cur.rubro += ' ' + sp.rubro;
    cur.nota += ' ' + sp.nota;
  }
}
commit();

// Strip internal markers and post-process
for (const e of entries) delete e._epoca_missing;

const result = {
  source: 'https://sjfsemanal.scjn.gob.mx/listado-resultado-tesis',
  parsed_at: new Date().toISOString(),
  count: entries.length,
  items: entries,
};

if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.error(`Wrote ${OUT} (${entries.length} tesis)`);
} else {
  console.log(JSON.stringify(result, null, 2));
}
