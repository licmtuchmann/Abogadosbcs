#!/usr/bin/env node
// Ingest tesis from raw SJF Tesauro Penal pastes. Source format:
//
//   Registro digital:
//   <8-digit registro>
//   <RUBRO IN CAPS, may span multiple lines>
//    [TA|J]; <época>; <órgano>; <fuente>; Libro <N>, <Mes> de <Año>; Tomo <X>, Volumen <Y>; Pág. <N>
//   <numero de tesis> (Época abbrev)
//
// Reads /tmp/tesauro_p*.txt files (or any list of paths given as argv).
// Adds each tesis to public/data/precedentes.json as a placeholder with
// materia_penal='penal' (verified by tesauro source) and text_pending=true.
// Detail hydrator will fill texto + ejecutoria later.
//
// Anti-alucinación: source_url is the canonical sjf2 detail URL for the
// registro. The hydrator confirms or invalidates the rubro from the page.
//
// Usage:
//   node scripts/build/ingest_tesauro.mjs [paths...]
//   (defaults to /tmp/tesauro_p1.txt /tmp/tesauro_p2.txt)

import fs from 'node:fs';
import path from 'node:path';

const PRECEDENTES = path.resolve('public/data/precedentes.json');
const DEFAULT_PATHS = ['/tmp/tesauro_p1.txt', '/tmp/tesauro_p2.txt'];

function deriveOrgano(numero) {
  if (!numero) return null;
  const t = numero.toUpperCase();
  if (/^P\.?\s*\/?\s*J\./.test(t) || /^P\.?\s+[CDLMVIX]+/.test(t)) return 'Pleno';
  if (/^PR\.?/.test(t) || /^PLENO REGIONAL/.test(t)) return 'Plenos Regionales';
  if (/^1A\.?\s*\/?\s*J\./.test(t) || /^1A\.?\s+[CDLMVIX]+/.test(t)) return 'Primera Sala';
  if (/^2A\.?\s*\/?\s*J\./.test(t) || /^2A\.?\s+[CDLMVIX]+/.test(t)) return 'Segunda Sala';
  if (/T\.C\.C\.|TRIBUNAL/.test(t)) return 'Tribunal Colegiado de Circuito';
  return null;
}

function parseFuente(line) {
  // Expected: " [TA|J]; 11a. Época; T.C.C.; Gaceta S.J.F.; Libro 50, Junio de 2025; Tomo III, Volumen 2; Pág. 1586"
  const t = line.trim();
  if (!t.startsWith('[')) return null;
  const tipoMatch = t.match(/^\[(TA|J)\]\s*;\s*(.*)$/);
  if (!tipoMatch) return null;
  const tipo = tipoMatch[1] === 'J' ? 'Jurisprudencia' : 'Tesis Aislada';
  const parts = tipoMatch[2].split(';').map(s => s.trim());
  // parts: [epoca, organo, fuente, libro/mes, tomo/volumen, pagina]
  const epoca = parts[0] || null;
  const organo = parts[1] || null;
  const fuente = parts[2] || null;
  const libro = parts[3] || null;
  const pagina = parts.find(p => /^P[áa]g\./i.test(p))?.replace(/^P[áa]g\.\s*/i, '') || null;
  // Extract fecha (Mes Año) from libro
  let fecha = null;
  if (libro) {
    const m = libro.match(/Libro\s+\d+\s*,\s*([A-Za-záéíóúÁÉÍÓÚñÑ]+)\s+de\s+(\d{4})/i);
    if (m) {
      const meses = { enero:'01', febrero:'02', marzo:'03', abril:'04', mayo:'05', junio:'06',
        julio:'07', agosto:'08', septiembre:'09', octubre:'10', noviembre:'11', diciembre:'12' };
      const mm = meses[m[1].toLowerCase()];
      if (mm) fecha = `${m[2]}-${mm}-01`;
    }
  }
  return { tipo, epoca, organo, fuente, libro, pagina, fecha };
}

function parseTesauro(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith('registro digital:')) {
      const registro = (lines[i + 1] || '').trim();
      if (!/^\d{6,8}$/.test(registro)) { i++; continue; }
      // Collect rubro lines until we hit the " [TA]; ..." or " [J]; ..." line
      const rubroLines = [];
      let j = i + 2;
      while (j < lines.length) {
        const l = lines[j];
        if (l.trim().startsWith('[TA]') || l.trim().startsWith('[J]')) break;
        if (l.trim()) rubroLines.push(l.trim());
        j++;
      }
      const rubro = rubroLines.join(' ').replace(/\s+/g, ' ').trim();
      const fuenteLine = (lines[j] || '').trim();
      const meta = parseFuente(fuenteLine);
      const numeroLine = (lines[j + 1] || '').trim();
      const numero = numeroLine || null;
      if (registro && rubro && meta) {
        const organoFromNum = deriveOrgano(numero) || meta.organo;
        entries.push({
          registro,
          rubro,
          numero,
          tipo: meta.tipo,
          epoca: meta.epoca,
          organo: organoFromNum,
          fuente: meta.fuente || 'Semanario Judicial de la Federación',
          fecha: meta.fecha,
          pagina: meta.pagina,
        });
      }
      i = j + 2;
    } else {
      i++;
    }
  }
  return entries;
}

function main() {
  const argv = process.argv.slice(2);
  const paths = argv.length ? argv : DEFAULT_PATHS;
  const all = [];
  for (const p of paths) {
    if (!fs.existsSync(p)) {
      console.warn(`[tesauro] no existe: ${p} — se salta`);
      continue;
    }
    const txt = fs.readFileSync(p, 'utf8');
    const parsed = parseTesauro(txt);
    console.log(`[tesauro] ${p}: ${parsed.length} tesis parseadas`);
    all.push(...parsed);
  }
  // Dedupe by registro
  const seen = new Set();
  const unique = [];
  for (const e of all) {
    if (seen.has(e.registro)) continue;
    seen.add(e.registro);
    unique.push(e);
  }
  console.log(`[tesauro] Total únicas: ${unique.length}`);

  const ds = JSON.parse(fs.readFileSync(PRECEDENTES, 'utf8'));
  const byId = new Map(ds.items.map(i => [String(i.registro || i.id), i]));
  let added = 0, updated = 0;
  for (const e of unique) {
    const existing = byId.get(String(e.registro));
    const sourceUrl = `https://sjf2.scjn.gob.mx/detalle/tesis/${e.registro}`;
    const placeholder = {
      id: `sjf:${e.registro}`,
      registro: e.registro,
      numero: e.numero,
      rubro: e.rubro,
      organo: e.organo,
      tipo: e.tipo,
      epoca: e.epoca,
      fecha: e.fecha,
      pagina: e.pagina,
      fuente: e.fuente,
      source_url: sourceUrl,
      verified_by: 'sjf_tesauro_penal',
      verified_at: new Date().toISOString().slice(0, 10),
      text_pending: true,
      ejecutoria: { text_pending: true, url_pending: true },
      articulos_relacionados: existing?.articulos_relacionados || [],
      materia_penal: 'penal',
    };
    if (existing) {
      if (existing.text_pending) {
        Object.assign(existing, placeholder);
        updated++;
      }
    } else {
      ds.items.push(placeholder);
      added++;
    }
  }
  ds.metadata = ds.metadata || {};
  ds.metadata.last_tesauro_run = {
    timestamp: new Date().toISOString(),
    sources: paths,
    parsed_count: unique.length,
    added,
    updated,
  };
  ds.metadata.last_updated = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(PRECEDENTES, JSON.stringify(ds, null, 2));
  console.log(`[tesauro] precedentes.json: +${added} nuevas · ${updated} actualizadas · total ${ds.items.length}`);
}

main();
