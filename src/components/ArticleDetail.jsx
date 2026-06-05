import { useMemo, useState } from 'react';
import { ArrowLeft, Copy, Bookmark, History, Link2, FileText, CheckCircle2 } from 'lucide-react';
import SourceBadge from './SourceBadge';
import { wordDiff } from '../lib/diff';
import { citeArticle, copyToClipboard } from '../lib/citation';
import { addNote, loadNotebooks } from '../lib/storage';

export default function ArticleDetail({ article, vigenteDOF, onBack, relatedPrecedentes = [], onOpenPrecedente }) {
  const [showHistory, setShowHistory] = useState(false);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const cit = useMemo(() => citeArticle(article, vigenteDOF), [article, vigenteDOF]);
  const historyEntry = article.history?.[historyIdx];

  const diff = useMemo(() => {
    if (!historyEntry || historyEntry.status !== 'redaccion_anterior') return null;
    return wordDiff(historyEntry.text || '', article.text || '');
  }, [historyEntry, article.text]);

  async function copyCitation() {
    await copyToClipboard(cit.text + ' ' + (article.source_url || ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  async function copyArticleText() {
    const txt = `${article.label}. ${article.heading}\n\n${article.text}\n\n— ${cit.text}\n${article.source_url || ''}`;
    await copyToClipboard(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  function saveToNotebook() {
    const notebooks = loadNotebooks();
    const id = notebooks[0]?.id || 'default';
    addNote(id, {
      kind: 'articulo',
      ref_id: article.id,
      label: article.label,
      heading: article.heading,
      text: article.text,
      source_url: article.source_url,
      vigenteDOF,
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
        <SourceBadge
          url={article.source_url}
          label={`DOF ${vigenteDOF}`}
          verifiedAt={vigenteDOF}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">
          {[article.book, article.title, article.chapter, article.section].filter(Boolean).join(' › ')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1 text-balance">
          {article.label}. {article.heading}
        </h1>

        <div className="flex flex-wrap gap-2 mt-3 no-print">
          <Action onClick={copyArticleText} icon={<FileText size={14} />} label={copied ? '¡Copiado!' : 'Copiar texto'} active={copied} />
          <Action onClick={copyCitation} icon={<Copy size={14} />} label="Copiar cita" />
          <Action onClick={saveToNotebook} icon={<Bookmark size={14} />} label={saved ? '¡Guardado!' : 'Guardar en cuaderno'} active={saved} />
          {article.history?.length > 0 && (
            <Action
              onClick={() => setShowHistory(s => !s)}
              icon={<History size={14} />}
              label={`${article.history.length} reforma${article.history.length > 1 ? 's' : ''} previas`}
              active={showHistory}
            />
          )}
        </div>

        <article className="article-prose mt-5 text-slate-800">
          {article.text.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </div>

      {showHistory && article.history?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-sm font-semibold text-amber-900 inline-flex items-center gap-2">
              <History size={16} /> Historial de reforma
            </h2>
            <div className="flex gap-1.5 flex-wrap">
              {article.history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setHistoryIdx(i)}
                  className={`text-xs px-2 py-1 rounded border ${i === historyIdx ? 'bg-amber-900 text-white border-amber-900' : 'bg-white text-amber-900 border-amber-300'}`}
                >
                  Antes de DOF {nextDof(article.history, i, vigenteDOF)}
                </button>
              ))}
            </div>
          </div>

          {historyEntry?.status === 'no_existia' ? (
            <div className="text-sm text-amber-900">
              Este artículo <strong>no existía</strong> en la versión vigente al {historyEntry.dof}. Fue adicionado posteriormente.
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-1">
                  Redacción anterior (vigente hasta DOF {historyEntry.dof})
                </div>
                <div className="bg-white border border-amber-200 rounded-lg p-3 text-sm text-slate-800 whitespace-pre-wrap font-serif">
                  {historyEntry?.text}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800 mb-1">
                  Redacción vigente (con cambios resaltados)
                </div>
                <div className="bg-white border border-emerald-200 rounded-lg p-3 text-sm text-slate-800 font-serif">
                  {diff && diff.map((seg, i) =>
                    seg.type === 'eq' ? <span key={i}>{seg.text}</span>
                    : seg.type === 'add' ? <mark key={i} className="diff-add">{seg.text}</mark>
                    : <mark key={i} className="diff-del">{seg.text}</mark>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {relatedPrecedentes?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={14} className="text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-900">Precedentes que aplican este artículo</h2>
            <span className="text-xs text-slate-500">({relatedPrecedentes.length})</span>
          </div>
          <ul className="space-y-2">
            {relatedPrecedentes.map(p => (
              <li key={p.id}>
                <button onClick={() => onOpenPrecedente(p)} className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2.5">
                  <div className="text-[11px] uppercase tracking-wide text-amber-700">{p.organo}</div>
                  <div className="text-sm font-medium text-slate-900">{p.heading}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function nextDof(history, i, vigenteDOF) {
  if (i === 0) return vigenteDOF;
  return history[i - 1].dof;
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
