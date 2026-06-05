import { useState } from 'react';
import { ArrowLeft, ExternalLink, Copy, Bookmark, CheckCircle2, FileText, Library, Download } from 'lucide-react';
import SourceBadge from './SourceBadge';
import { copyToClipboard } from '../lib/citation';
import { addNote, loadNotebooks } from '../lib/storage';

export default function CompendioDetail({ compendio, onBack }) {
  const c = compendio.raw || compendio;
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const citation =
    `${c.title}, ${c.publisher}${c.serie ? ' (' + c.serie + ')' : ''}${c.year && c.year !== '—' ? ', ' + c.year : ''}. Disponible en: ${c.source_url}`;

  async function doCopy() {
    await copyToClipboard(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  function save() {
    const id = loadNotebooks()[0]?.id || 'default';
    addNote(id, {
      kind: 'compendio',
      ref_id: c.id,
      label: c.serie || c.publisher,
      heading: c.title,
      text: c.text || `Tema: ${c.topic}. Fuente: ${c.source_url}`,
      source_url: c.source_url,
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
        <SourceBadge url={c.source_url} label={c.publisher || 'SCJN'} verifiedAt={c.verified_at} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-indigo-700 font-medium">
          <Library size={13} /> {c.serie || 'Compendio'}{c.year && c.year !== '—' ? ` · ${c.year}` : ''}
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 text-balance">
          {c.title}
        </h1>
        <div className="text-sm text-slate-600 mt-1">{c.publisher}</div>
        {c.topic && (
          <div className="text-[11px] text-slate-500 mt-2">
            <span className="font-semibold text-slate-600">Tema:</span> {c.topic}
          </div>
        )}
        {Array.isArray(c.tags) && c.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {c.tags.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{t}</span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4 no-print">
          <a href={c.source_url} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700">
            <ExternalLink size={14} /> Abrir PDF oficial
          </a>
          <a href={c.source_url} download
             className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border bg-white border-slate-300 hover:border-slate-500">
            <Download size={14} /> Descargar
          </a>
          <button onClick={doCopy} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border transition ${copied ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'}`}>
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? '¡Copiado!' : 'Copiar cita'}
          </button>
          <button onClick={save} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border transition ${saved ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'}`}>
            {saved ? <CheckCircle2 size={14} /> : <Bookmark size={14} />} {saved ? '¡Guardado!' : 'Guardar en cuaderno'}
          </button>
        </div>

        {c.text_pending && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="font-semibold mb-1 flex items-center gap-1.5"><FileText size={14} /> Texto íntegro pendiente</div>
            <p>
              El PDF está verificado en la fuente oficial. La acción semanal de GitHub descarga el archivo, lo procesa con
              <code className="mono mx-1">pdftotext</code> y queda indexado para búsqueda interna. Mientras tanto, el botón
              "Abrir PDF oficial" lleva a la versión original sin intermediarios.
            </p>
          </div>
        )}

        {!c.text_pending && c.text && (
          <article className="article-prose mt-5 text-slate-800 whitespace-pre-wrap text-[14px] leading-relaxed">
            {c.text}
          </article>
        )}
      </div>
    </div>
  );
}
