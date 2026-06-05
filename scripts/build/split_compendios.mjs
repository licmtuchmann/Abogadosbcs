#!/usr/bin/env node
// Splits public/data/compendios.json into a slim index plus per-item detail
// files under public/data/compendios/<id>.json. The index stays light so the
// PWA precache doesn't ship 11 MB on first paint; full text loads on demand
// when the user opens a compendio.

import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('public/data/compendios.json');
const OUT_DIR = path.resolve('public/data/compendios');
const SNIPPET_LEN = 1200; // chars — enough for Fuse.js relevance ranking

function safeFilename(id) {
  return id.replace(/[^a-z0-9_-]+/gi, '_') + '.json';
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`No existe ${SRC}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let withText = 0, indexOnly = 0;
  const slimItems = data.items.map(item => {
    const detailPath = path.join(OUT_DIR, safeFilename(item.id));
    if (item.text && item.text.length > SNIPPET_LEN) {
      // Write full detail file
      fs.writeFileSync(detailPath, JSON.stringify(item, null, 2));
      withText++;
      const { text, ...rest } = item;
      return {
        ...rest,
        snippet: text.slice(0, SNIPPET_LEN),
        text_length: text.length,
        detail_url: `data/compendios/${safeFilename(item.id)}`,
      };
    }
    indexOnly++;
    return item;
  });

  const slimDataset = {
    metadata: {
      ...data.metadata,
      split_at: new Date().toISOString(),
      lazy_load: true,
      snippet_length: SNIPPET_LEN,
    },
    items: slimItems,
  };
  fs.writeFileSync(SRC, JSON.stringify(slimDataset, null, 2));

  console.log(`Index: ${slimItems.length} items (${withText} con texto íntegro en detalle, ${indexOnly} sin texto adicional).`);
  console.log(`Tamaño del índice: ${(fs.statSync(SRC).size / 1024).toFixed(0)} KB`);
}

main();
