#!/usr/bin/env node
// Pipeline semanal — descarga el PDF vigente del CNPP desde Cámara de
// Diputados, lo convierte a texto y dispara el parser/diff. Si la fecha
// "Última reforma DOF" del documento descargado coincide con la del dataset
// actual, sale sin cambios.

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

const OUT_DIR = '/tmp/cnpp_fetch';
const PDF_URL = 'https://www.diputados.gob.mx/LeyesBiblio/pdf/CNPP.pdf';
const DOC_URL = 'https://www.diputados.gob.mx/LeyesBiblio/doc/CNPP.doc';
const CURRENT_JSON = path.resolve('public/data/cnpp.json');

function read(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

async function downloadTo(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': 'BuscadorPenalMX/0.1' } });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

function which(bin) {
  try { return execSync(`which ${bin}`).toString().trim(); } catch { return ''; }
}

function docToTxt(docPath, txtPath) {
  // Prefer catdoc (UTF-8 capable, lightweight)
  if (which('catdoc')) {
    const r = spawnSync('catdoc', ['-d', 'utf-8', docPath], { encoding: 'utf8' });
    if (r.status === 0) { fs.writeFileSync(txtPath, r.stdout); return true; }
  }
  // Fallback: pdftotext
  if (docPath.endsWith('.pdf') && which('pdftotext')) {
    const r = spawnSync('pdftotext', ['-layout', docPath, txtPath]);
    if (r.status === 0) return true;
  }
  return false;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const docPath = path.join(OUT_DIR, 'CNPP.doc');
  console.log('[CNPP] Descargando .doc desde Cámara de Diputados...');
  try {
    await downloadTo(DOC_URL, docPath);
  } catch (e) {
    console.warn(`[CNPP] .doc falló (${e.message}). Intentando PDF...`);
    await downloadTo(PDF_URL, path.join(OUT_DIR, 'CNPP.pdf'));
  }

  // Convert all sources in OUT_DIR
  for (const f of fs.readdirSync(OUT_DIR)) {
    const ext = path.extname(f).toLowerCase();
    if (ext !== '.doc' && ext !== '.pdf') continue;
    const txt = path.join(OUT_DIR, f.replace(ext, '.txt'));
    if (!fs.existsSync(txt)) {
      console.log(`[CNPP] Convirtiendo ${f} → ${path.basename(txt)}`);
      if (!docToTxt(path.join(OUT_DIR, f), txt)) {
        console.warn(`[CNPP] No se pudo convertir ${f}. Instala catdoc o pdftotext.`);
      }
    }
  }

  // Run parser
  console.log('[CNPP] Reconstruyendo dataset...');
  const r = spawnSync('node', [path.resolve('scripts/build/parse_cnpp.mjs'), OUT_DIR, CURRENT_JSON], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);

  const cur = read(CURRENT_JSON);
  console.log(`[CNPP] DOF vigente: ${cur?.metadata?.vigente_dof}`);
}

main().catch(e => { console.error(e); process.exit(1); });
