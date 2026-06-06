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
  const [cnpp, precedentes, compendios, manifest] = await Promise.all([
    fetchJSON('data/cnpp.json', { articles: [], repealed: [], metadata: {} }),
    fetchJSON('data/precedentes.json', { items: [], metadata: {} }),
    fetchJSON('data/compendios.json', { items: [], metadata: {} }),
    fetchJSON('data/manifest.json', { built_at: null }),
  ]);

  // Strict filter: drop any precedente that doesn't have a verifiable source URL
  // OR that has been explicitly classified as non-penal materia.
  const verified = (precedentes.items || []).filter(p =>
    p && p.source_url && /^https?:\/\//i.test(p.source_url)
       && p.materia_penal !== 'no_penal'
  );
  const verifiedCompendios = (compendios.items || []).filter(c =>
    c && c.source_url && /^https?:\/\//i.test(c.source_url)
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
    compendios: {
      metadata: compendios.metadata || {},
      items: verifiedCompendios,
      dropped: (compendios.items?.length || 0) - verifiedCompendios.length,
      lazy: !!compendios.metadata?.lazy_load,
    },
    manifest,
  };
}

// Lazy-load the full text of a single compendio. Called by CompendioDetail
// only when the user opens that compendio's detail view. Result is cached by
// the browser HTTP cache + workbox StaleWhileRevalidate, so re-opening is
// instantaneous.
const compendioCache = new Map();
export async function loadCompendioDetail(item) {
  if (!item) return null;
  if (item.text) return item; // already has full text inline (small item)
  const cacheKey = item.id;
  if (compendioCache.has(cacheKey)) return compendioCache.get(cacheKey);
  if (!item.detail_url) return item; // nothing to fetch
  try {
    const r = await fetch(base + item.detail_url, { cache: 'default' });
    if (!r.ok) throw new Error(`${item.detail_url} → HTTP ${r.status}`);
    const full = await r.json();
    compendioCache.set(cacheKey, full);
    return full;
  } catch (e) {
    console.warn(`No se pudo cargar el detalle de ${item.id}:`, e.message);
    return item;
  }
}
