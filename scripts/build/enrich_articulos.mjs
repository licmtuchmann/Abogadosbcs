#!/usr/bin/env node
// Escanea public/data/precedentes.json y:
//   1. Extrae referencias a artículos del CNPP del rubro, texto y ejecutoria
//      → pobla articulos_relacionados[] automáticamente.
//   2. Detecta si el precedente es de materia penal mediante keywords
//      → asigna materia_penal: 'penal' | 'no_penal' | 'desconocida'.
//
// Anti-alucinación: solo extrae números que (a) caen en el rango válido
// 1-490 del CNPP vigente y (b) aparecen explícitamente seguidos por la
// palabra CNPP, "Código Nacional" o variantes reconocidas.
//
// Se ejecuta:
//   - Una vez para retro-anotar el dataset existente.
//   - Después de cada hidratación SJF/CIDH en el workflow semanal.

import fs from 'node:fs';
import path from 'node:path';

const PRECEDENTES = path.resolve('public/data/precedentes.json');
const MAX_ART = 490;

const PENAL_KEYWORDS = [
  // Sujetos procesales
  'imputado', 'imputada', 'inculpado', 'acusado', 'sentenciado', 'procesado',
  'ministerio público', 'fiscal', 'fiscalía', 'defensor', 'defensora', 'defensa técnica',
  'víctima', 'ofendido', 'asesor jurídico de la víctima',
  // Etapas del proceso acusatorio
  'audiencia inicial', 'audiencia intermedia', 'juicio oral', 'tribunal de enjuiciamiento',
  'juez de control', 'juzgado de control', 'carpeta de investigación', 'carpeta administrativa',
  'vinculación a proceso', 'auto de vinculación', 'control de detención',
  'investigación complementaria', 'descubrimiento probatorio',
  // Medidas y soluciones
  'prisión preventiva', 'criterio de oportunidad', 'acuerdo reparatorio',
  'suspensión condicional', 'procedimiento abreviado', 'mecanismo alternativo',
  'medida cautelar penal', 'medida de protección',
  // Detenciones y actos de investigación
  'flagrancia', 'caso urgente', 'cateo', 'arraigo', 'control preventivo provisional',
  'orden de aprehensión', 'inviolabilidad de las comunicaciones',
  // Recursos penales
  'amparo penal', 'amparo directo en revisión', 'apelación penal',
  // Sistema penal acusatorio
  'sistema penal acusatorio', 'sistema procesal penal acusatorio',
  'código nacional de procedimientos penales', 'cnpp',
  'código penal', 'tipo penal', 'delito',
  // Constitucionales con relevancia penal directa
  'presunción de inocencia', 'defensa adecuada', 'no autoincriminación',
  'debido proceso', // borderline, lo dejamos como suficiente solo si OTRO penal-keyword
];

const NON_PENAL_NEGATIVE = [
  // Estos solos descartan penal cuando no hay otros indicios penales
  'controversia constitucional', 'acción de inconstitucionalidad',
  'organización administrativa', 'categoría administrativa municipal',
  'derechos por servicios', 'proporcionalidad tributaria', 'derecho del autor',
  'libertad de trabajo', 'persona notaria', 'función notarial',
];

function lc(s) { return (s || '').toLowerCase(); }

function extractCNPPArticles(text) {
  if (!text) return [];
  const ids = new Set();
  const patterns = [
    /art[íi]culo[s]?\s+([\d,\s]+(?:y\s+\d+)?)[\s\S]{0,80}?(?:CNPP|C[óo]digo\s+Nacional\s+de\s+Procedimientos\s+Penales|C\.N\.P\.P\.)/gi,
    /\bart\.\s*(\d+(?:[\s,y]+\d+)*)[\s\S]{0,40}?(?:CNPP|C[óo]digo\s+Nacional)/gi,
    /(?:CNPP|C[óo]digo\s+Nacional\s+de\s+Procedimientos\s+Penales)[\s\S]{0,80}?art[íi]culo[s]?\s+(\d+(?:[\s,y]+\d+)*)/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text))) {
      const nums = m[1].match(/\d+/g) || [];
      for (const n of nums) {
        const id = parseInt(n, 10);
        if (id >= 1 && id <= MAX_ART) ids.add(String(id));
      }
    }
  }
  return [...ids].sort((a, b) => parseInt(a) - parseInt(b));
}

function detectMateriaPenal(p, articulosRelacionados) {
  // Señal fuerte: cita explícita de art. CNPP
  if (articulosRelacionados.length > 0) return 'penal';

  const text = lc([
    p.rubro, p.titulo, p.texto, p.contenido, p.precedente, p.tema,
    p.ejecutoria?.text, p.ejecutoria?.tipo_juicio, p.ejecutoria?.expediente,
    (p.materias || []).join(' '),
  ].filter(Boolean).join(' '));

  if (!text.trim()) return 'desconocida';

  const hits = PENAL_KEYWORDS.filter(k => text.includes(k));
  const negHits = NON_PENAL_NEGATIVE.filter(k => text.includes(k));

  // Materias declarada por el SJF — señal autoritativa
  if (p.materias && p.materias.some(m => /penal/i.test(m))) return 'penal';

  if (hits.length >= 2) return 'penal';
  if (hits.length === 1 && negHits.length === 0) return 'penal';
  if (negHits.length > 0 && hits.length === 0) return 'no_penal';
  return 'desconocida';
}

function gatherText(p) {
  return [
    p.rubro || '', p.titulo || '', p.texto || '', p.contenido || '',
    p.precedente || '', p.tema || '',
    p.ejecutoria?.text || '', p.ejecutoria?.tipo_juicio || '', p.ejecutoria?.expediente || '',
  ].join('\n');
}

function main() {
  const data = JSON.parse(fs.readFileSync(PRECEDENTES, 'utf8'));
  let touched = 0, withRefs = 0;
  const buckets = { penal: 0, no_penal: 0, desconocida: 0 };
  for (const p of data.items) {
    const existing = new Set((p.articulos_relacionados || []).map(String));
    const extracted = extractCNPPArticles(gatherText(p));
    const merged = new Set([...existing, ...extracted]);
    if (merged.size > existing.size) touched++;
    p.articulos_relacionados = [...merged].sort((a, b) => parseInt(a) - parseInt(b));
    if (p.articulos_relacionados.length) withRefs++;

    const materia = detectMateriaPenal(p, p.articulos_relacionados);
    p.materia_penal = materia;
    buckets[materia]++;
  }
  data.metadata = data.metadata || {};
  data.metadata.last_enriched_at = new Date().toISOString();
  data.metadata.materia_breakdown = buckets;
  fs.writeFileSync(PRECEDENTES, JSON.stringify(data, null, 2));
  console.log(`[enrich] ${touched} items con art. CNPP nuevos · ${withRefs}/${data.items.length} con al menos un CNPP referenciado`);
  console.log(`[enrich] Materia: ${buckets.penal} penal · ${buckets.no_penal} no_penal · ${buckets.desconocida} desconocida`);
}

main();
