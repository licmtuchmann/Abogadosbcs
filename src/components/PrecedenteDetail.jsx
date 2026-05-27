import { useState } from 'react';
import { ArrowLeft, Copy, Bookmark, CheckCircle2, FileText } from 'lucide-react';
import SourceBadge from './SourceBadge';
import { citePrecedente, copyToClipboard } from '../lib/citation';
import { addNote, loadNotebooks } from '../lib/storage';

export default function PrecedenteDetail({ precedente, onBack, onOpenArticle, articleIndex = {} }) {
  const p = precedente.raw || precedente;
  const cit = citePrecedente(p);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  async function doCopy() {
    await copyToClipboard(cit.text + (p.source_url ? '\n' + p.source_url : ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  function save() {
    const id = loadNotebooks()[0]?.id || 'default';
    addNote(id, {
      kind: 'precedente',
      ref_id: p.id || p.registro || p.numero,
      label: p.numero || p.registro,
      heading: p.rubro || p.titulo,
      text: p.texto || p.contenido,
      organo: p.organo,
      source_url: p.source_url,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Volver
        </button>
        <SourceBadge url={p.source_url} label={p.fuente || p.organo || 'Fuente oficial'} verifiedAt={p.verified_at} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
        <div className="text-[11px] uppercase tracking-wide text-amber-700 font-medium">
          {[p.organo, p.tipo, p.epoca].filter(Boolean).join(' · ')}
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 text-balance">
          {p.rubro || p.titulo}
        </h1>
        <div className="text-xs text-slate-500 mt-1">
          {[p.numero, p.registro, p.fecha].filter(Boolean).join(' · ')}
        </div>

        <div className="flex flex-wrap gap-2 mt-3 no-print">
          <Action onClick={doCopy} icon={<FileText size={14} />} label={copied ? '¡Copiado!' : 'Copiar cita'} active={copied} />
          <Action onClick={save} icon={<Bookmark size={14} />} label={saved ? '¡Guardado!' : 'Guardar en cuaderno'} active={saved} />
        </div>

        <article className="article-prose mt-5 text-slate-800 whitespace-pre-wrap">
          {p.texto || p.contenido || '(Sin texto en el dataset)'}
        </article>

        {p.precedente && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Precedentes</div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{p.precedente}</div>
          </div>
        )}

        {p.articulos_relacionados?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Artículos del CNPP citados</div>
            <div className="flex flex-wrap gap-1.5">
              {p.articulos_relacionados.map(id => {
                const a = articleIndex[String(id)];
                if (!a) return <span key={id} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500">Art. {id}</span>;
                return (
                  <button key={id} onClick={() => onOpenArticle(a)} className="text-xs px-2 py-1 bg-slate-900 text-white rounded hover:bg-slate-700">
                    {a.label}: {a.heading.slice(0, 40)}{a.heading.length > 40 ? '…' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Action({ onClick, icon, label, active }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border transition ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'}`}
    >
      {active ? <CheckCircle2 size={14} /> : icon} {label}
    </button>
  );
}
