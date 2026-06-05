import { useState } from 'react';
import { ArrowLeft, Copy, Bookmark, CheckCircle2, FileText, ScrollText, ExternalLink } from 'lucide-react';
import SourceBadge from './SourceBadge';
import { citePrecedente, copyToClipboard } from '../lib/citation';
import { addNote, loadNotebooks } from '../lib/storage';

export default function PrecedenteDetail({ precedente, onBack, onOpenArticle, articleIndex = {} }) {
  const p = precedente.raw || precedente;
  const ej = p.ejecutoria || null;
  const cit = citePrecedente(p);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('tesis');

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

        <div className="mt-5 flex gap-1 border-b border-slate-200">
          <TabButton active={tab === 'tesis'} onClick={() => setTab('tesis')} icon={<FileText size={13} />}>
            Tesis / Síntesis
          </TabButton>
          <TabButton active={tab === 'ejecutoria'} onClick={() => setTab('ejecutoria')} icon={<ScrollText size={13} />} badge={ej?.text ? 'disponible' : ej?.source_url ? 'enlace' : 'pendiente'}>
            Ejecutoria (precedente)
          </TabButton>
        </div>

        {tab === 'tesis' && (
          p.text_pending ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="font-semibold mb-1">Texto pendiente de ingesta</div>
              <p>
                Esta tesis fue verificada manualmente y está registrada con su URL oficial en el Semanario Judicial de la Federación.
                El cuerpo completo se carga con la actualización semanal o puedes consultarlo ahora en la fuente oficial:
              </p>
              <a
                href={p.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-amber-900 text-white text-sm font-medium hover:bg-amber-800"
              >
                Abrir en SJF — registro {p.registro} <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <article className="article-prose mt-4 text-slate-800 whitespace-pre-wrap">
              {p.texto || p.contenido || '(Sin texto en el dataset)'}
            </article>
          )
        )}

        {tab === 'ejecutoria' && (
          <div className="mt-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-900 mb-3">
              <strong>Sistema constitucional de precedentes</strong> (art. 94 CPEUM, reforma 11-mar-2021 · arts. 222-228 Ley de Amparo):
              las razones contenidas en la ejecutoria son lo vinculante; la tesis es solo síntesis. Citar el precedente sin leer
              la ejecutoria expone a omitir matices que pueden confirmar o desvirtuar la tesis.
            </div>

            {!ej || (!ej.text && !ej.source_url) ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Esta tesis no tiene una ejecutoria identificada todavía. El scraper la descubrirá automáticamente en el próximo
                corrido semanal a partir de la página de la tesis.
              </div>
            ) : (
              <>
                <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-slate-700 mb-3">
                  {ej.tipo_juicio && (<><dt className="text-slate-500">Tipo de juicio</dt><dd className="font-medium">{ej.tipo_juicio}</dd></>)}
                  {ej.expediente && (<><dt className="text-slate-500">Expediente</dt><dd className="font-medium">{ej.expediente}</dd></>)}
                  {ej.ponente && (<><dt className="text-slate-500">Ponente</dt><dd className="font-medium">{ej.ponente}</dd></>)}
                  {ej.fecha_resolucion && (<><dt className="text-slate-500">Resolución</dt><dd className="font-medium">{ej.fecha_resolucion}</dd></>)}
                </dl>
                {ej.source_url && (
                  <a href={ej.source_url} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                    <ExternalLink size={12} /> Abrir ejecutoria oficial
                  </a>
                )}
                {ej.text ? (
                  <article className="article-prose mt-4 text-slate-800 whitespace-pre-wrap text-[14px] leading-relaxed border-l-2 border-emerald-300 pl-4">
                    {ej.text}
                  </article>
                ) : (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="font-semibold mb-1">Texto íntegro de la ejecutoria pendiente</div>
                    <p>El enlace al fallo está verificado; el cuerpo completo se descarga con la próxima ingesta semanal.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

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

function TabButton({ active, onClick, icon, badge, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm px-3 py-2 border-b-2 -mb-px transition ${active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
    >
      {icon} {children}
      {badge && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${badge === 'disponible' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : badge === 'enlace' ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-300 bg-slate-50 text-slate-600'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}
