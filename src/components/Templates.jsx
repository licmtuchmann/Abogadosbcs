import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { copyToClipboard } from '../lib/citation';

// Minimal templates with placeholders. Strict guideline: every legal cite
// must be filled in by the lawyer using the search; the templates DON'T
// pre-fill jurisprudencia to avoid invented citations.

const TEMPLATES = [
  {
    id: 'queja-detencion',
    title: 'Queja por violación al art. 16 constitucional (control de la detención)',
    body: `H. JUEZ DE CONTROL DEL CENTRO DE JUSTICIA PENAL FEDERAL DE [DISTRITO/CIRCUITO]:

[NOMBRE COMPLETO DEL DEFENSOR], en mi carácter de Defensor particular/público del imputado [NOMBRE], dentro de la carpeta administrativa [NÚMERO], con el debido respeto comparezco para EXPONER:

PRIMERO. Que con fundamento en los artículos 16 y 20 apartado B de la Constitución Política de los Estados Unidos Mexicanos, así como 17, 113 fracción I y XIV, y 149 del Código Nacional de Procedimientos Penales, vengo a SOLICITAR el control judicial de la detención de mi defendido, pues estimo que la misma se llevó a cabo en contravención al texto constitucional, por las siguientes razones:

[NARRACIÓN DE LOS HECHOS Y RAZONES JURÍDICAS POR LAS QUE LA DETENCIÓN NO SE AJUSTÓ A LOS SUPUESTOS DE FLAGRANCIA O CASO URGENTE]

SEGUNDO. Solicito se decrete la libertad inmediata del imputado y se exhorte al Ministerio Público a observar las obligaciones del artículo 132 del CNPP.

[CITAR PRECEDENTES APLICABLES DESDE LA BÚSQUEDA — no inventar]

Por lo anteriormente expuesto:

ÚNICO. Tenerme por presentado, decretar la ilegalidad de la detención y ordenar la libertad inmediata del imputado.

PROTESTO LO NECESARIO,
[CIUDAD], a [FECHA].

[FIRMA]`,
  },
  {
    id: 'oposicion-vinculacion',
    title: 'Oposición al auto de vinculación a proceso',
    body: `H. JUEZ DE CONTROL:

[NOMBRE], en mi carácter de Defensor del imputado [NOMBRE], dentro de la causa penal [NÚMERO], con fundamento en los artículos 19 constitucional, 314, 315, 316 y 317 del CNPP, dentro de la audiencia inicial me opongo a la vinculación a proceso, en atención a:

I. NO EXISTEN DATOS DE PRUEBA SUFICIENTES QUE ESTABLEZCAN UN HECHO QUE LA LEY SEÑALE COMO DELITO.
[FUNDAR Y MOTIVAR]

II. NO EXISTE LA PROBABILIDAD DE QUE EL IMPUTADO LO COMETIÓ O PARTICIPÓ EN SU COMISIÓN.
[FUNDAR Y MOTIVAR]

III. SE ACTUALIZA UNA CAUSA DE EXTINCIÓN O EXCLUYENTE DEL DELITO.
[EN SU CASO]

[CITAR PRECEDENTES APLICABLES — usa el buscador]

Por lo expuesto, solicito se dicte AUTO DE NO VINCULACIÓN A PROCESO conforme al artículo 319 del CNPP.

[FIRMA]`,
  },
  {
    id: 'apelacion',
    title: 'Recurso de apelación contra sentencia definitiva',
    body: `H. TRIBUNAL DE ENJUICIAMIENTO, POR CONDUCTO DE QUIEN PRESIDIÓ LA AUDIENCIA:

[NOMBRE], Defensor del sentenciado [NOMBRE], dentro de la causa penal [NÚMERO], con fundamento en los artículos 20 constitucional, 458, 461, 467 fracción IX, 468, 471 y 481 del Código Nacional de Procedimientos Penales, vengo a INTERPONER RECURSO DE APELACIÓN contra la sentencia definitiva dictada el [FECHA] que condenó a mi defendido por el delito de [DELITO], conforme a los siguientes:

AGRAVIOS:

PRIMERO. [VIOLACIÓN A DERECHOS FUNDAMENTALES DURANTE EL PROCESO — fundar conforme art. 482]

SEGUNDO. [INDEBIDA VALORACIÓN DE LA PRUEBA — fundar conforme arts. 359 y 483]

TERCERO. [INDIVIDUALIZACIÓN DE LA PENA — fundar conforme arts. 410, 411]

[CITAR PRECEDENTES — usa el buscador]

POR LO TANTO PIDO se admita el recurso, se sustancie y se revoque o modifique la sentencia recurrida.

[FIRMA]`,
  },
  {
    id: 'amparo-directo',
    title: 'Demanda de amparo directo contra sentencia firme',
    body: `H. TRIBUNAL COLEGIADO DE CIRCUITO EN TURNO:

[NOMBRE], por mi propio derecho como sentenciado en la causa penal [NÚMERO], con domicilio para oír y recibir notificaciones en [DIRECCIÓN], y autorizando en términos amplios del art. 12 de la Ley de Amparo a [NOMBRES], con fundamento en los artículos 103 y 107 de la Constitución, y 170, 175, 176 y 181 de la Ley de Amparo, vengo a promover JUICIO DE AMPARO DIRECTO contra los siguientes:

I. ACTO RECLAMADO: La sentencia definitiva dictada por [TRIBUNAL DE ALZADA] el [FECHA] dentro del toca penal [NÚMERO].

II. AUTORIDADES RESPONSABLES: [TRIBUNAL].

III. ANTECEDENTES: [BREVE RELATO]

IV. CONCEPTOS DE VIOLACIÓN:

PRIMERO. [VIOLACIÓN AL DEBIDO PROCESO — fundar]
SEGUNDO. [PRESUNCIÓN DE INOCENCIA — fundar]
TERCERO. [DEFENSA ADECUADA — fundar]

[CITAR PRECEDENTES APLICABLES — usa el buscador]

V. PETITORIOS: Conceder el amparo y la protección de la Justicia Federal.

PROTESTO LO NECESARIO,
[FIRMA]`,
  },
  {
    id: 'alegatos-clausura',
    title: 'Guion de alegatos de clausura',
    body: `ALEGATOS DE CLAUSURA — DEFENSA

1. INTRODUCCIÓN Y TEORÍA DEL CASO
[Tres frases con la teoría del caso de la defensa]

2. PRESUNCIÓN DE INOCENCIA (art. 13 CNPP, art. 20 B I CPEUM)
[Recordar el estándar de prueba: convicción más allá de duda razonable, art. 402 CNPP]

3. ANÁLISIS DE LOS HECHOS PROBADOS
3.1 [Hecho 1] — prueba que lo sustenta / prueba que lo contradice
3.2 [Hecho 2] — idem
3.3 [Hecho 3] — idem

4. PRUEBA DE CARGO INSUFICIENTE
[Identificar cada elemento del tipo penal y demostrar la insuficiencia]

5. DUDA RAZONABLE
[Articular contra-narrativas plausibles que sostiene la evidencia]

6. PRECEDENTES APLICABLES
[Llenar desde el buscador]

7. PETICIÓN
Solicito una sentencia ABSOLUTORIA conforme a los artículos 402 y 406 del CNPP.`,
  },
];

export default function Templates() {
  const [openId, setOpenId] = useState(TEMPLATES[0].id);
  const t = TEMPLATES.find(x => x.id === openId);

  function downloadTxt() {
    const blob = new Blob([t.body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-3">
      <ul className="space-y-1">
        {TEMPLATES.map(x => (
          <li key={x.id}>
            <button
              onClick={() => setOpenId(x.id)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition ${openId === x.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
            >
              {x.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
          <h3 className="text-base font-semibold text-slate-900">{t.title}</h3>
          <div className="flex gap-2">
            <button onClick={() => copyToClipboard(t.body)} className="text-xs px-2.5 py-1.5 rounded border bg-white border-slate-300 hover:border-slate-500 inline-flex items-center gap-1.5">
              <Copy size={14} /> Copiar
            </button>
            <button onClick={downloadTxt} className="text-xs px-2.5 py-1.5 rounded border bg-white border-slate-300 hover:border-slate-500 inline-flex items-center gap-1.5">
              <Download size={14} /> Descargar .txt
            </button>
          </div>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-slate-800 font-serif leading-relaxed">{t.body}</pre>
        <div className="mt-4 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          ⚠ Las plantillas son esqueletos; los precedentes y argumentos se completan caso por caso desde el buscador, nunca a partir de citas pre-cargadas no verificadas.
        </div>
      </div>
    </div>
  );
}
