// Data loader with strict source verification.
// Any item without a source_url is filtered out — hard fail anti-hallucination.

const base = import.meta.env.BASE_URL || './';

async function fetchJSON(path, fallback) {
  try {
    const r = await fetch(base + path, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn(`No se pudo cargar ${path}:`, e.message);
    return fallback;
  }
}

export async function loadDataset() {
  const [cnpp, precedentes, manifest] = await Promise.all([
    fetchJSON('data/cnpp.json', { articles: [], repealed: [], metadata: {} }),
    fetchJSON('data/precedentes.json', { items: [], metadata: {} }),
    fetchJSON('data/manifest.json', { built_at: null }),
  ]);

  // Strict filter: drop any precedente that doesn't have a verifiable source URL
  const verified = (precedentes.items || []).filter(p =>
    p && p.source_url && /^https?:\/\//i.test(p.source_url)
  );

  return {
    cnpp: {
      metadata: cnpp.metadata || {},
      articles: cnpp.articles || [],
      repealed: cnpp.repealed || [],
    },
    precedentes: {
      metadata: precedentes.metadata || {},
      items: verified,
      dropped: (precedentes.items?.length || 0) - verified.length,
    },
    manifest,
  };
}
