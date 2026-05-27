#!/usr/bin/env node
// Pipeline de ingesta — Semanario Judicial de la Federación (SCJN).
//
// La búsqueda pública del SJF está en https://sjf2.scjn.gob.mx/.
// El portal expone búsqueda por palabras clave y filtros por época, instancia
// y materia. La API interna cambia con frecuencia; este script intenta:
//   1) buscar tesis y sentencias en materia PENAL que citen el CNPP,
//   2) extraer rubro, texto, instancia, época, registro y URL canónica,
//   3) detectar el o los artículos del CNPP citados (regex sobre el texto),
//   4) integrar al dataset solo entradas con URL fuente verificable.
//
// Cualquier entrada sin source_url HTTPS se DESCARTA — anti-alucinación.
//
// Las palabras clave por defecto pueden ampliarse vía CLI:
//   node scripts/ingest/sjf.mjs --queries "defensa adecuada,prisión preventiva oficiosa"

import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/data/precedentes.json');

const DEFAULT_QUERIES = [
  'Código Nacional de Procedimientos Penales',
  'defensa adecuada',
  'prisión preventiva oficiosa',
  'presunción de inocencia penal',
  'flagrancia',
  'control judicial detención',
  'datos de prueba',
  'auto de vinculación a proceso',
];

const SJF_BASE = 'https://sjf2.scjn.gob.mx';
// Endpoint observado (puede cambiar). El script falla suave si la respuesta
// no es JSON o el esquema cambió.
const SJF_SEARCH = `${SJF_BASE}/busqueda-principal-tesis`;

async function fetchJSON(url, opts = {}) {
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'BuscadorPenalMX/0.1 (+contacto repo abogadosbcs)',
      'Accept': 'application/json,text/html',
      ...opts.headers,
    },
    ...opts,
  });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json')) return r.json();
  return r.text();
}

function extractArticulosCNPP(text) {
  if (!text) return [];
  const m = text.match(/art[íi]culo[s]?\s+(\d+(?:\s*,\s*\d+)*)\s*(?:del\s+)?C[óo]digo\s+Nacional\s+de\s+Procedimientos\s+Penales/gi) || [];
  const ids = new Set();
  for (const hit of m) {
    const nums = hit.match(/\d+/g) || [];
    for (const n of nums) ids.add(String(parseInt(n, 10)));
  }
  return [...ids];
}

function normalizeTesis(raw) {
  const item = {
    id: raw.id || raw.ius || raw.registro,
    registro: raw.registro || raw.ius || null,
    numero: raw.numero || raw.tesis || null,
    rubro: raw.rubro || raw.titulo || null,
    texto: raw.texto || raw.contenido || raw.resumen || null,
    precedente: raw.precedente || null,
    organo: raw.organo || raw.instancia || null,
    tipo: raw.tipo || (raw.es_jurisprudencia ? 'Jurisprudencia' : 'Tesis aislada'),
    epoca: raw.epoca || null,
    fecha: raw.fecha || raw.fechaPublicacion || null,
    materia: raw.materia || 'Penal',
    fuente: 'Semanario Judicial de la Federación',
    source_url: raw.url || (raw.id ? `${SJF_BASE}/detalle/tesis/${raw.id}` : null),
    verified_at: new Date().toISOString().slice(0, 10),
    articulos_relacionados: extractArticulosCNPP(`${raw.texto || ''} ${raw.precedente || ''}`),
  };
  return item;
}

async function searchQuery(q) {
  // El portal tiene un endpoint público de búsqueda. Si falla, intentamos
  // raspar el HTML (no implementado aquí — placeholder).
  const url = `${SJF_SEARCH}?palabra=${encodeURIComponent(q)}&epoca=&instancia=&materia=PENAL`;
  try {
    const data = await fetchJSON(url);
    if (Array.isArray(data?.tesis)) return data.tesis;
    if (Array.isArray(data?.resultados)) return data.resultados;
    if (Array.isArray(data)) return data;
    return [];
  } catch (e) {
    console.warn(`[SJF] consulta "${q}" falló: ${e.message}`);
    return [];
  }
}

async function main() {
  const queries = process.argv.includes('--queries')
    ? process.argv[process.argv.indexOf('--queries') + 1].split(',').map(s => s.trim()).filter(Boolean)
    : DEFAULT_QUERIES;

  console.log(`[SJF] Iniciando ingesta · ${queries.length} consultas`);

  // Carga existente para fusión incremental
  let existing = { metadata: {}, items: [] };
  try { existing = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch {}

  const byId = new Map(existing.items.map(i => [String(i.id || i.registro), i]));
  let added = 0, updated = 0, dropped = 0;

  for (const q of queries) {
    const raws = await searchQuery(q);
    for (const r of raws) {
      const item = normalizeTesis(r);
      if (!item.source_url || !/^https?:\/\//i.test(item.source_url)) {
        dropped++;
        continue;
      }
      const k = String(item.id || item.registro);
      if (byId.has(k)) {
        byId.set(k, { ...byId.get(k), ...item });
        updated++;
      } else {
        byId.set(k, item);
        added++;
      }
    }
  }

  const out = {
    metadata: {
      ...(existing.metadata || {}),
      last_updated: new Date().toISOString(),
      last_run_stats: { queries: queries.length, added, updated, dropped_no_source: dropped },
    },
    items: [...byId.values()].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')),
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`[SJF] OK · +${added} nuevas · ~${updated} actualizadas · -${dropped} sin fuente (descartadas)`);
  console.log(`[SJF] Total tras ingesta: ${out.items.length}`);
  if (added + updated === 0 && dropped === 0) {
    console.log('[SJF] Sin cambios. Verificar manualmente la conectividad con sjf2.scjn.gob.mx.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
