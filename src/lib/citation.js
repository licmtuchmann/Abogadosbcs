// Citation formatter — generates the legal citation string and a Markdown
// link that bundles the official source URL. Never invents data.

export function citeArticle(a, vigenteDOF) {
  const dof = vigenteDOF || 'DOF vigente';
  const main = `Artículo ${a.number}${rom(a.number)} del Código Nacional de Procedimientos Penales (última reforma DOF ${dof})`;
  const md = `[${main}](${a.source_url || ''})`;
  return { text: main, markdown: md };
}

export function citePrecedente(p) {
  const parts = [];
  if (p.rubro || p.titulo) parts.push(`"${p.rubro || p.titulo}"`);
  if (p.numero) parts.push(p.numero);
  if (p.organo) parts.push(p.organo);
  if (p.epoca) parts.push(p.epoca);
  if (p.fecha) parts.push(p.fecha);
  if (p.fuente) parts.push(p.fuente);
  const text = parts.join(', ');
  const ejecBits = [];
  if (p.ejecutoria?.tipo_juicio) ejecBits.push(p.ejecutoria.tipo_juicio);
  if (p.ejecutoria?.expediente) ejecBits.push(`exp. ${p.ejecutoria.expediente}`);
  if (p.ejecutoria?.ponente) ejecBits.push(`ponente: ${p.ejecutoria.ponente}`);
  if (p.ejecutoria?.fecha_resolucion) ejecBits.push(`resuelto ${p.ejecutoria.fecha_resolucion}`);
  const ejecText = ejecBits.length ? ` — Ejecutoria: ${ejecBits.join(', ')}` : '';
  const fullText = text + ejecText;
  const md = p.source_url
    ? `[${text}](${p.source_url})${p.ejecutoria?.source_url ? ` · [ejecutoria](${p.ejecutoria.source_url})` : ''}`
    : fullText;
  return { text: fullText, markdown: md };
}

function rom(n) {
  // 1o./2o./3o. style is kept implicit in the article number for first 9 articles
  if (n <= 9) return 'o.';
  return '';
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); return true; }
    catch { return false; }
    finally { document.body.removeChild(ta); }
  }
}
