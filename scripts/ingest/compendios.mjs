#!/usr/bin/env node
// Hidrata public/data/compendios.json descargando cada PDF (SCJN, BJV-UNAM,
// etc.) y extrayendo el texto con pdftotext. Solo procesa items con
// text_pending=true. Si la descarga o la extracción falla, mantiene el
// estado pendiente — nunca inventa texto.
//
// Requiere: poppler-utils (pdftotext). En el workflow se instala vía apt.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execSync } from 'node:child_process';

const OUT = path.resolve('public/data/compendios.json');
const TMP = '/tmp/compendios_pdfs';
const MAX_TEXT_KB = 1024; // truncate per item to keep dataset under ~30MB total

function which(bin) {
  try { return execSync(`which ${bin}`).toString().trim(); } catch { return ''; }
}

async function downloadTo(url, dest) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'BuscadorPenalMX/0.1 (compendios)' },
    redirect: 'follow',
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function pdfToText(pdfPath) {
  if (!which('pdftotext')) throw new Error('pdftotext no instalado (poppler-utils)');
  const txtPath = pdfPath.replace(/\.pdf$/i, '.txt');
  const r = spawnSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, txtPath]);
  if (r.status !== 0) throw new Error(`pdftotext salió con status ${r.status}`);
  return fs.readFileSync(txtPath, 'utf8');
}

function truncate(s, maxBytes) {
  if (!s) return s;
  const buf = Buffer.from(s, 'utf8');
  if (buf.length <= maxBytes) return s;
  return buf.slice(0, maxBytes).toString('utf8') + '\n\n[…texto truncado por longitud — consulte el PDF oficial…]';
}

function safeFilename(id) {
  return id.replace(/[^a-z0-9_-]+/gi, '_') + '.pdf';
}

async function main() {
  fs.mkdirSync(TMP, { recursive: true });
  const data = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  let hydrated = 0, failed = 0, skipped = 0;

  for (const c of data.items) {
    if (!c.text_pending) { skipped++; continue; }
    if (!c.source_url || !/^https?:\/\//i.test(c.source_url)) { failed++; continue; }

    const dest = path.join(TMP, safeFilename(c.id));
    try {
      console.log(`[compendios] ↓ ${c.id}`);
      const size = await downloadTo(c.source_url, dest);
      const text = pdfToText(dest);
      const trimmed = truncate(text.trim(), MAX_TEXT_KB * 1024);
      if (!trimmed || trimmed.length < 100) throw new Error('texto extraído demasiado corto');
      c.text = trimmed;
      c.text_pending = false;
      c.text_length = text.length;
      c.pdf_bytes = size;
      c.verified_at = new Date().toISOString().slice(0, 10);
      hydrated++;
    } catch (e) {
      console.warn(`[compendios] ✗ ${c.id}: ${e.message}`);
      failed++;
    }
  }

  data.metadata = data.metadata || {};
  data.metadata.last_updated = new Date().toISOString();
  data.metadata.last_run_stats = { hydrated, failed, skipped };
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));

  console.log(`[compendios] OK · +${hydrated} con texto · ↺${skipped} ya hidratados · ✗${failed} fallaron`);
  if (hydrated === 0 && failed > 0) {
    console.log('[compendios] Si el sandbox bloquea el dominio, ejecutar en el GitHub Action que tiene red abierta.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
