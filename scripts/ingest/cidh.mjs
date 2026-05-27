#!/usr/bin/env node
// Pipeline de ingesta — Corte Interamericana de Derechos Humanos.
// Fuente: https://www.corteidh.or.cr/cf/jurisprudencia2/index.cfm?lang=es
// La Corte IDH publica un buscador con sentencias, opiniones consultivas y
// resoluciones de supervisión. No expone API JSON estable; este script
// raspa el HTML público y guarda solo entradas con URL canónica.
// Se mantiene la regla anti-alucinación: sin source_url → descartar.

import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/data/precedentes.json');

const CIDH_BASE = 'https://www.corteidh.or.cr';
// Listado público de fichas técnicas con criterios penales relevantes
const CIDH_LIST = `${CIDH_BASE}/cf/jurisprudencia2/busqueda_casos_contenciosos.cfm?lang=es`;

const KEYWORDS_PENALES = [
  'garantías judiciales',
  'libertad personal',
  'integridad personal',
  'presunción de inocencia',
  'defensa',
  'plazo razonable',
  'prisión preventiva',
];

async function fetchText(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'BuscadorPenalMX/0.1' }
  });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  return r.text();
}

function stripHTML(s) { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

// Parser mínimo del listado. La estructura del sitio cambia ocasionalmente;
// si el regex falla, regresa lista vacía sin invalidar el dataset.
function parseList(html) {
  const out = [];
  const rowRe = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  for (const row of html.match(rowRe) || []) {
    const linkM = row.match(/href="([^"]*ficha[^"]+)"[^>]*>([^<]+)</i);
    if (!linkM) continue;
    const url = linkM[1].startsWith('http') ? linkM[1] : `${CIDH_BASE}${linkM[1].startsWith('/') ? '' : '/cf/jurisprudencia2/'}${linkM[1]}`;
    const titulo = stripHTML(linkM[2]);
    out.push({ url, titulo });
  }
  return out;
}

async function main() {
  console.log('[CIDH] Iniciando ingesta de fichas con criterio penal');

  let existing = { metadata: {}, items: [] };
  try { existing = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch {}
  const byId = new Map(existing.items.map(i => [String(i.id || i.source_url), i]));
  let added = 0, dropped = 0;

  let listHtml = '';
  try { listHtml = await fetchText(CIDH_LIST); } catch (e) {
    console.warn(`[CIDH] No se pudo obtener el listado: ${e.message}`);
  }
  const items = parseList(listHtml);
  console.log(`[CIDH] ${items.length} fichas encontradas`);

  for (const it of items) {
    // Solo guardamos un esbozo seguro: rubro + URL. El texto íntegro debe
    // descargarse desde el PDF oficial vinculado en la ficha, lo cual queda
    // pendiente para evitar texto inventado/incompleto.
    const looksPenal = KEYWORDS_PENALES.some(k => it.titulo.toLowerCase().includes(k));
    if (!looksPenal) continue;

    if (!/^https?:\/\//i.test(it.url)) { dropped++; continue; }
    const id = `cidh:${it.url}`;
    if (byId.has(id)) continue;
    byId.set(id, {
      id,
      organo: 'Corte Interamericana de Derechos Humanos',
      tipo: 'Sentencia / Ficha técnica',
      rubro: it.titulo,
      texto: null, // se llena en pasada posterior tras descargar PDF
      fuente: 'Corte IDH',
      source_url: it.url,
      verified_at: new Date().toISOString().slice(0, 10),
      articulos_relacionados: [],
    });
    added++;
  }

  const out = {
    metadata: {
      ...(existing.metadata || {}),
      last_updated_cidh: new Date().toISOString(),
    },
    items: [...byId.values()],
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`[CIDH] OK · +${added} fichas nuevas · -${dropped} sin URL válida`);
}

main().catch(e => { console.error(e); process.exit(1); });
