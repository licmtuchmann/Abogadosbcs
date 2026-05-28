#!/usr/bin/env node
// Verificador de integridad del dataset.
// - Cada precedente debe tener source_url HTTPS.
// - El dataset CNPP debe tener metadata.vigente_dof.
// - Reporta artículos cuyo texto está vacío (potencial error de parse).
// Sale con código != 0 si hay infracciones.

import fs from 'node:fs';
import path from 'node:path';

const cnppPath = path.resolve('public/data/cnpp.json');
const prePath = path.resolve('public/data/precedentes.json');
const compPath = path.resolve('public/data/compendios.json');

let errors = 0;

function load(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.error(`No se pudo leer ${p}: ${e.message}`); errors++; return null; }
}

const cnpp = load(cnppPath);
if (cnpp) {
  if (!cnpp.metadata?.vigente_dof) { console.error('CNPP: falta metadata.vigente_dof'); errors++; }
  const empty = (cnpp.articles || []).filter(a => !a.text || a.text.length < 20);
  if (empty.length) {
    console.error(`CNPP: ${empty.length} artículos con texto vacío o muy corto (potencial error de parse):`);
    for (const a of empty.slice(0, 10)) console.error(`  - ${a.label} (id ${a.id})`);
  }
  console.log(`CNPP: ${cnpp.articles?.length || 0} artículos, ${cnpp.repealed?.length || 0} derogados, DOF ${cnpp.metadata?.vigente_dof}`);
}

const pre = load(prePath);
if (pre) {
  const bad = (pre.items || []).filter(p => !p.source_url || !/^https?:\/\//i.test(p.source_url));
  if (bad.length) {
    console.error(`PRECEDENTES: ${bad.length} entradas sin URL fuente válida — anti-alucinación las descarta en runtime.`);
    errors += Math.min(bad.length, 1);
  }
  const pending = (pre.items || []).filter(p => p.text_pending);
  const full = (pre.items || []).filter(p => !p.text_pending && (p.texto || p.contenido));
  console.log(`PRECEDENTES: ${pre.items?.length || 0} ítems totales (${full.length} con texto · ${pending.length} pendientes de ingesta · ${(pre.items || []).filter(p => p.source_url).length} con fuente)`);
}

const comp = load(compPath);
if (comp) {
  const bad = (comp.items || []).filter(c => !c.source_url || !/^https?:\/\//i.test(c.source_url));
  if (bad.length) {
    console.error(`COMPENDIOS: ${bad.length} entradas sin URL fuente válida.`);
    errors += Math.min(bad.length, 1);
  }
  const pending = (comp.items || []).filter(c => c.text_pending);
  const full = (comp.items || []).filter(c => !c.text_pending && c.text);
  console.log(`COMPENDIOS: ${comp.items?.length || 0} ítems totales (${full.length} con texto · ${pending.length} pendientes de ingesta · ${(comp.items || []).filter(c => c.source_url).length} con fuente)`);
}

if (errors) {
  console.error(`\n${errors} problema(s) de integridad detectado(s).`);
  process.exit(1);
}
console.log('\nOK — dataset íntegro.');
