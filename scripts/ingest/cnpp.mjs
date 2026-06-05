#!/usr/bin/env node
// Pipeline semanal del CNPP — descarga el .doc vigente desde Cámara de
// Diputados, lo convierte a texto, lo agrega al directorio histórico
// scripts/build/sources/cnpp/primary/ (con nombre cnpp_<DOF>.txt), y vuelve
// a correr el parser CONTRA TODAS las versiones disponibles para preservar
// el campo `history` por artículo.
//
// Si la versión descargada coincide con la última que ya tenemos en el
// directorio histórico, no toca nada y sale limpio. Si es nueva, la suma
// al set permanente y re-genera el dataset.

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

const TMP_DIR = '/tmp/cnpp_fetch';
const DOC_URL = 'https://www.diputados.gob.mx/LeyesBiblio/doc/CNPP.doc';
const PDF_URL = 'https://www.diputados.gob.mx/LeyesBiblio/pdf/CNPP.pdf';
const PRIMARY_DIR = path.resolve('scripts/build/sources/cnpp/primary');
const FALLBACK_DIR = path.resolve('scripts/build/sources/cnpp/fallback');
const OUT_JSON = path.resolve('public/data/cnpp.json');
const PARSER = path.resolve('scripts/build/parse_cnpp.mjs');

function which(bin) {
  try { return execSync(`which ${bin}`).toString().trim(); } catch { return ''; }
}

async function downloadTo(url, dest) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'BuscadorPenalMX/0.1 (+cnpp-weekly)' },
    redirect: 'follow',
  });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

function convertWithCatdoc(docPath, outPath) {
  if (!which('catdoc')) return false;
  const r = spawnSync('catdoc', ['-d', 'utf-8', docPath], { encoding: 'utf8' });
  if (r.status !== 0) return false;
  fs.writeFileSync(outPath, r.stdout);
  return true;
}

function convertWithAntiword(docPath, outPath) {
  if (!which('antiword')) return false;
  const r = spawnSync('antiword', ['-m', 'UTF-8.txt', docPath], { encoding: 'utf8' });
  if (r.status !== 0) return false;
  fs.writeFileSync(outPath, r.stdout);
  return true;
}

function extractDOF(txt) {
  const m = txt.slice(0, 4000).match(/Última reforma publicada DOF\s+(\d{2})-(\d{2})-(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function listExistingDOFs() {
  if (!fs.existsSync(PRIMARY_DIR)) return [];
  return fs.readdirSync(PRIMARY_DIR)
    .map(f => f.match(/^cnpp_(\d{4}-\d{2}-\d{2})\.txt$/))
    .filter(Boolean)
    .map(m => m[1])
    .sort();
}

async function main() {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(PRIMARY_DIR, { recursive: true });
  fs.mkdirSync(FALLBACK_DIR, { recursive: true });

  // 1. Descargar la versión vigente
  const docTmp = path.join(TMP_DIR, 'CNPP.doc');
  console.log('[CNPP] Descargando .doc desde diputados.gob.mx...');
  try {
    await downloadTo(DOC_URL, docTmp);
  } catch (e) {
    console.error(`[CNPP] No se pudo descargar .doc: ${e.message}`);
    process.exit(1);
  }

  // 2. Convertir con ambos motores
  const txtPrimary = path.join(TMP_DIR, 'CNPP.primary.txt');
  const txtFallback = path.join(TMP_DIR, 'CNPP.fallback.txt');
  if (!convertWithCatdoc(docTmp, txtPrimary)) {
    console.error('[CNPP] catdoc falló. Instala poppler-utils + catdoc en el runner.');
    process.exit(1);
  }
  if (!convertWithAntiword(docTmp, txtFallback)) {
    console.warn('[CNPP] antiword no disponible. Continuando solo con catdoc.');
  }

  // 3. Detectar fecha DOF de la versión descargada
  const dof = extractDOF(fs.readFileSync(txtPrimary, 'utf8'));
  if (!dof) {
    console.error('[CNPP] No pude extraer la fecha DOF del archivo descargado.');
    process.exit(1);
  }
  console.log(`[CNPP] Versión descargada: DOF ${dof}`);

  // 4. ¿Es nueva?
  const existing = listExistingDOFs();
  const isKnown = existing.includes(dof);
  if (isKnown) {
    console.log(`[CNPP] DOF ${dof} ya está en el set histórico (${existing.length} versiones). Sin cambios.`);
    // Aún así regeneramos cnpp.json para no romper si alguien borró el JSON.
  } else {
    console.log(`[CNPP] DOF ${dof} es NUEVA. Agregando al set histórico permanente.`);
    fs.copyFileSync(txtPrimary, path.join(PRIMARY_DIR, `cnpp_${dof}.txt`));
    if (fs.existsSync(txtFallback)) {
      fs.copyFileSync(txtFallback, path.join(FALLBACK_DIR, `cnpp_${dof}.txt`));
    }
  }

  // 5. Re-parsear contra TODAS las versiones disponibles
  console.log('[CNPP] Reconstruyendo dataset contra el set histórico completo...');
  const r = spawnSync('node', [PARSER, PRIMARY_DIR, FALLBACK_DIR, OUT_JSON], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);

  try {
    const ds = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
    console.log(`[CNPP] OK · vigente_dof=${ds.metadata.vigente_dof} · ${ds.metadata.versions_processed?.length} versiones · ${ds.articles.length} artículos`);
  } catch {}
}

main().catch(e => { console.error(e); process.exit(1); });
