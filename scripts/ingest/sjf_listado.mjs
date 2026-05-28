#!/usr/bin/env node
// Weekly automated ingest from the SJF "Listado de Tesis" feed.
//
// Source: https://sjfsemanal.scjn.gob.mx/listado-resultado-tesis
//
// Strategy:
//   1. GET the URL. If response is HTML, parse for the embedded PDF link or
//      the listing table inline. If response is a PDF, save it.
//   2. Convert PDF to text via pdftotext (-layout).
//   3. Run scripts/build/parse_listado_sjf.mjs to get structured entries.
//   4. Merge each entry into public/data/precedentes.json as a placeholder
//      (rubro and metadata known, body text and ejecutoria text pending).
//   5. Call scripts/ingest/sjf.mjs to hydrate each placeholder from its
//      detail page (rubro overwritten with canonical, texto/ejecutoria filled).
//
// Anti-alucinación: every entry has source_url verified; the body remains
// text_pending=true until the detail hydrator confirms it.

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

const LISTADO_URL = 'https://sjfsemanal.scjn.gob.mx/listado-resultado-tesis';
const TMP_DIR = '/tmp/sjf_listado';
const PRECEDENTES = path.resolve('public/data/precedentes.json');
const PARSER = path.resolve('scripts/build/parse_listado_sjf.mjs');

function which(bin) {
  try { return execSync(`which ${bin}`).toString().trim(); } catch { return ''; }
}

async function fetchBuffer(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'BuscadorPenalMX/0.1 (+sjf-listado-weekly)' },
    redirect: 'follow',
  });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  const ct = r.headers.get('content-type') || '';
  const buf = Buffer.from(await r.arrayBuffer());
  return { buf, contentType: ct };
}

function extractPdfLinksFromHtml(html) {
  const links = [];
  const re = /href=["']([^"']+\.pdf[^"']*)["']/gi;
  let m;
  while ((m = re.exec(html))) links.push(m[1]);
  return [...new Set(links)];
}

async function downloadListadoPdf() {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const { buf, contentType } = await fetchBuffer(LISTADO_URL);

  if (contentType.includes('application/pdf') || buf.slice(0, 4).toString() === '%PDF') {
    const dest = path.join(TMP_DIR, 'listado.pdf');
    fs.writeFileSync(dest, buf);
    return dest;
  }

  if (contentType.includes('text/html') || contentType.includes('text/plain')) {
    const html = buf.toString('utf8');
    const links = extractPdfLinksFromHtml(html);
    if (!links.length) {
      const htmlOut = path.join(TMP_DIR, 'listado.html');
      fs.writeFileSync(htmlOut, html);
      throw new Error(`No PDF link found in HTML response. Saved page to ${htmlOut} for inspection.`);
    }
    const pdfUrl = links[0].startsWith('http') ? links[0]
      : new URL(links[0], LISTADO_URL).toString();
    console.log(`[listado] Following PDF link: ${pdfUrl}`);
    const { buf: pdfBuf } = await fetchBuffer(pdfUrl);
    const dest = path.join(TMP_DIR, 'listado.pdf');
    fs.writeFileSync(dest, pdfBuf);
    return dest;
  }

  throw new Error(`Unexpected content-type from ${LISTADO_URL}: ${contentType}`);
}

function pdfToText(pdfPath) {
  if (!which('pdftotext')) throw new Error('pdftotext no instalado (apt install poppler-utils)');
  const txtPath = pdfPath.replace(/\.pdf$/i, '.txt');
  const r = spawnSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, txtPath]);
  if (r.status !== 0) throw new Error(`pdftotext salió con status ${r.status}`);
  return txtPath;
}

function runParser(txtPath) {
  const outPath = txtPath.replace(/\.txt$/i, '.json');
  const r = spawnSync('node', [PARSER, txtPath, '--out', outPath], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`parser falló con status ${r.status}`);
  return JSON.parse(fs.readFileSync(outPath, 'utf8'));
}

function mergeIntoPrecedentes(parsed) {
  const ds = JSON.parse(fs.readFileSync(PRECEDENTES, 'utf8'));
  const byId = new Map(ds.items.map(i => [String(i.registro || i.id), i]));
  let added = 0, updated = 0;

  for (const e of parsed.items) {
    const key = String(e.registro);
    const existing = byId.get(key);
    const placeholder = {
      id: `sjf:${e.registro}`,
      registro: e.registro,
      numero: e.numero || null,
      rubro: e.rubro || null,
      rubro_partial: e.rubro_partial || false,
      organo: e.organo || null,
      tipo: e.tipo || null,
      epoca: e.epoca || null,
      fecha: e.fecha_publicacion || null,
      fuente: 'Semanario Judicial de la Federación',
      source_url: e.source_url,
      verified_by: 'sjf_listado_weekly',
      verified_at: new Date().toISOString().slice(0, 10),
      text_pending: true,
      ejecutoria: { text_pending: true, url_pending: true },
      articulos_relacionados: existing?.articulos_relacionados || [],
    };
    if (existing) {
      // Don't clobber items that already have full text
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
  ds.metadata.last_listado_run = {
    timestamp: new Date().toISOString(),
    source: LISTADO_URL,
    parsed_count: parsed.count,
    added,
    updated,
  };
  ds.metadata.last_updated = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(PRECEDENTES, JSON.stringify(ds, null, 2));
  return { added, updated };
}

async function main() {
  console.log(`[listado] Descargando listado semanal desde ${LISTADO_URL}`);
  let pdfPath;
  try {
    pdfPath = await downloadListadoPdf();
  } catch (e) {
    console.error(`[listado] No se pudo descargar el listado: ${e.message}`);
    console.error('[listado] Si el sandbox bloquea sjfsemanal.scjn.gob.mx, ejecutar en GitHub Action.');
    process.exit(1);
  }
  console.log(`[listado] PDF guardado en ${pdfPath}`);

  const txtPath = pdfToText(pdfPath);
  const parsed = runParser(txtPath);
  console.log(`[listado] Parseadas ${parsed.count} tesis`);

  const { added, updated } = mergeIntoPrecedentes(parsed);
  console.log(`[listado] precedentes.json: +${added} nuevas · ~${updated} actualizadas`);
  console.log('[listado] Siguiente paso: ejecutar scripts/ingest/sjf.mjs para hidratar.');
}

main().catch(e => { console.error(e); process.exit(1); });
