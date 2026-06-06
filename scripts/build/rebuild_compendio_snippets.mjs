#!/usr/bin/env node
// Re-generates the search snippets in public/data/compendios.json based on
// the existing detail files in public/data/compendios/<id>.json. The old
// snippet (first 1.2 KB) only captured the cover page; the new strategy
// samples diverse chunks across the document so legal keywords (tortura,
// flagrancia, defensa adecuada, etc.) are present in the search index.
//
// Strategy: skip the first ~6 KB (front matter), then take chunks from
// ~10%, ~35%, ~60%, ~85% of the document. Total snippet ~18 KB per
// compendio. The index grows from ~52 KB to ~500 KB — still tiny vs the
// 11 MB pre-lazy-load, and search now actually works.

import fs from 'node:fs';
import path from 'node:path';

const INDEX = path.resolve('public/data/compendios.json');
const DETAILS_DIR = path.resolve('public/data/compendios');

const FRONT_MATTER_SKIP = 6000;
const CHUNK_SIZE = 4500;
const CHUNK_POSITIONS = [0.10, 0.35, 0.60, 0.85];

function buildSnippet(text) {
  if (!text) return '';
  const len = text.length;
  if (len <= FRONT_MATTER_SKIP + CHUNK_SIZE) return text.slice(0, Math.min(len, 8000));

  const body = text.slice(FRONT_MATTER_SKIP);
  const bodyLen = body.length;
  const parts = [];
  for (const pct of CHUNK_POSITIONS) {
    const start = Math.floor(bodyLen * pct);
    parts.push(body.slice(start, start + CHUNK_SIZE));
  }
  // Compress runs of whitespace to keep the snippet dense
  return parts.join('\n\n[…]\n\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n');
}

function main() {
  const data = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  let updated = 0, skipped = 0;
  for (const c of data.items) {
    if (!c.detail_url) { skipped++; continue; }
    const detailPath = path.join(DETAILS_DIR, path.basename(c.detail_url));
    if (!fs.existsSync(detailPath)) { skipped++; continue; }
    const detail = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
    if (!detail.text) { skipped++; continue; }
    c.snippet = buildSnippet(detail.text);
    updated++;
  }
  data.metadata.snippet_strategy = 'spread_sampling_v2';
  data.metadata.snippet_chunks = CHUNK_POSITIONS.length;
  data.metadata.snippet_chunk_size = CHUNK_SIZE;
  data.metadata.snippets_rebuilt_at = new Date().toISOString();
  fs.writeFileSync(INDEX, JSON.stringify(data, null, 2));
  const newSize = fs.statSync(INDEX).size;
  console.log(`[snippets] ${updated} compendios con nuevo snippet · ${skipped} sin detalle`);
  console.log(`[snippets] Tamaño del índice: ${(newSize / 1024).toFixed(0)} KB`);
}

main();
