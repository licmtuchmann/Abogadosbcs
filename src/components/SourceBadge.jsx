import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

export default function SourceBadge({ url, label, verifiedAt, small = false }) {
  if (!url) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
        <AlertTriangle size={12} />
        Sin fuente verificable — no se muestra
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 ${small ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-1'} text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100`}
      title={`Verificada${verifiedAt ? ` el ${verifiedAt}` : ''} · ${label || 'Fuente oficial'}`}
    >
      <ShieldCheck size={small ? 11 : 13} />
      <span className="truncate max-w-[200px]">{label || 'Fuente verificada'}</span>
      <ExternalLink size={small ? 10 : 12} />
    </a>
  );
}
