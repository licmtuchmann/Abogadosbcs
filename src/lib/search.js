// Hybrid lexical search over CNPP articles + precedentes using Fuse.js.
// Semantic enrichment is deferred to a later pass (transformers.js / MiniLM)
// to keep the bundle small for first paint. Lexical search is augmented with
// a synonym layer to bridge common legal-language gaps.

import Fuse from 'fuse.js';

const SYNONYMS = [
  ['imputado', 'inculpado', 'acusado', 'procesado'],
  ['defensa', 'defensor', 'asistencia jurídica', 'asesoría jurídica'],
  ['víctima', 'ofendido', 'agraviado'],
  ['ministerio público', 'mp', 'fiscalía', 'fiscal'],
  ['detención', 'detenido', 'aprehensión'],
  ['prisión preventiva', 'prision preventiva'],
  ['flagrancia', 'flagrante'],
  ['caso urgente', 'urgencia'],
  ['orden de aprehensión', 'orden de captura'],
  ['cateo', 'orden de cateo'],
  ['amparo', 'juicio de amparo'],
  ['debido proceso', 'garantías procesales'],
  ['no autoincriminación', 'no declarar contra sí mismo', 'derecho al silencio'],
  ['presunción de inocencia', 'presuncion de inocencia'],
  ['suspensión condicional', 'suspension condicional'],
  ['acuerdos reparatorios', 'mediación', 'mecanismos alternativos'],
  ['procedimiento abreviado', 'abreviado'],
  ['etapa intermedia', 'audiencia intermedia'],
  ['juicio oral', 'audiencia de juicio'],
  ['apelación', 'recurso de apelación'],
  ['víctima', 'asesor jurídico de la víctima'],
];

function expandQuery(q) {
  const lower = q.toLowerCase();
  const extras = new Set();
  for (const group of SYNONYMS) {
    for (const term of group) {
      if (lower.includes(term)) {
        for (const sib of group) if (sib !== term) extras.add(sib);
      }
    }
  }
  if (!extras.size) return q;
  return q + ' ' + [...extras].join(' ');
}

export function makeIndex(dataset) {
  const docs = [];

  for (const a of dataset.cnpp.articles) {
    docs.push({
      kind: 'articulo',
      id: 'art:' + a.id,
      number: a.number,
      label: a.label,
      heading: a.heading,
      title: `${a.label}. ${a.heading}`,
      body: a.text,
      book: a.book,
      title_section: a.title,
      chapter: a.chapter,
      section: a.section,
      raw: a,
    });
  }

  for (const p of dataset.precedentes.items) {
    docs.push({
      kind: 'precedente',
      id: 'pre:' + (p.id || p.registro || p.numero),
      label: p.numero || p.registro || p.id || 'Tesis',
      heading: p.rubro || p.titulo || '',
      title: `${p.rubro || p.titulo || ''}`,
      body: [p.texto || p.contenido || '', p.rubro || '', p.precedente || ''].join('\n'),
      organo: p.organo || p.organo_emisor || '',
      tipo: p.tipo || '',
      epoca: p.epoca || '',
      fecha: p.fecha || '',
      tema: p.tema || '',
      articulos_relacionados: p.articulos_relacionados || [],
      raw: p,
    });
  }

  const fuse = new Fuse(docs, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.34,
    ignoreLocation: true,
    minMatchCharLength: 3,
    keys: [
      { name: 'title', weight: 3 },
      { name: 'heading', weight: 2.5 },
      { name: 'label', weight: 2 },
      { name: 'body', weight: 1 },
      { name: 'tema', weight: 1.5 },
    ],
  });

  return { fuse, docs };
}

export function searchIndex(index, query, filters = {}) {
  if (!query || !query.trim()) {
    // No query: filter docs by filters
    let docs = index.docs;
    docs = applyFilters(docs, filters);
    return docs.slice(0, 200).map(d => ({ item: d, score: 0 }));
  }
  const expanded = expandQuery(query);
  let results = index.fuse.search(expanded, { limit: 500 });
  if (filters && Object.keys(filters).length) {
    results = results.filter(r => matchesFilters(r.item, filters));
  }
  return results.slice(0, 200);
}

function applyFilters(docs, filters) {
  return docs.filter(d => matchesFilters(d, filters));
}

function matchesFilters(d, filters) {
  if (filters.kind && filters.kind !== 'todos' && d.kind !== filters.kind) return false;
  if (filters.organo && filters.organo !== 'todos' && d.kind === 'precedente') {
    if (!d.organo || !d.organo.toLowerCase().includes(filters.organo.toLowerCase())) return false;
  }
  if (filters.libro && filters.libro !== 'todos' && d.kind === 'articulo') {
    if (!d.book || !d.book.toLowerCase().includes(filters.libro.toLowerCase())) return false;
  }
  return true;
}

// Highlight helper — returns text with <mark> around matched terms (escape-safe)
export function highlight(text, query) {
  if (!text || !query) return text;
  const terms = expandQuery(query).split(/\s+/).filter(t => t.length >= 3);
  if (!terms.length) return text;
  const safe = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('(' + terms.map(escapeRe).join('|') + ')', 'gi');
  return safe.replace(pattern, '<mark class="bg-amber-200 text-slate-900 rounded px-0.5">$1</mark>');
}
