---
name: entrevista-testigo-mft
description: Formato institucional de ENTREVISTA A TESTIGO del despacho Meza Figueroa, Tuchmann & Asociados (MFT). Usar SIEMPRE que se mencione entrevista a testigo, entrevistar a un testigo, formato de entrevista, acta o registro de entrevista, preparar preguntas para un testigo, cuestionario para testigo, guion de entrevista, o cuando la defensa o la asesoría jurídica de la víctima necesite documentar el dicho de una persona (penal acusatorio, civil, familiar, laboral o cualquier materia). Genera el formato Word (.docx) con hoja membretada MFT, ya sea EN BLANCO para llenarse a mano o LLENADO total o parcialmente por Claude (datos generales, fecha y hora con número y letra, preguntas y respuestas, relato). Todo dato no proporcionado queda como línea en blanco para completarse a mano.
---

# Entrevista a testigo — despacho MFT

Genera el formato de **ENTREVISTA A TESTIGO** del despacho a partir del modelo
institucional. El formato conserva la estructura del modelo original del despacho
y agrega secciones numeradas, sección de preguntas y respuestas, cierre y firmas.

## Contenido de la skill

| Ruta | Uso |
|------|-----|
| `assets/ENTREVISTA_TESTIGO_PLANTILLA.docx` | Formato modelo **en blanco**, listo para imprimir y llenar a mano. |
| `scripts/generar_entrevista.py` | Generador: produce el formato en blanco o llenado con un JSON. |
| `scripts/ejemplo_datos.json` | Ejemplo **ficticio** de la estructura del JSON. |
| `references/guia-preguntas.md` | Metodología para preparar las preguntas y conducir la entrevista. |
| `assets/logo-mark.png` | Logotipo para el encabezado membretado. |

## Estructura del formato

1. **Encabezado**: logotipo + "MEZA FIGUEROA, TUCHMANN & ASOCIADOS" + leyenda de confidencialidad.
2. **ENTREVISTA A TESTIGO** y **NÚMERO ÚNICO DE CAUSA (NUC)** (etiqueta configurable: carpeta de investigación, expediente, causa penal, toca). Asunto opcional.
3. **I. Datos de la diligencia**: lugar; fecha y hora de inicio; entrevistador(a); entrevistado(a).
4. **II. Datos generales**: domicilio del testigo; tiempo de residencia en esta ciudad; correo electrónico; edad; media filiación; apodo; sexo; teléfono celular; ocupación; domicilio laboral; identificación (tipo y número); relación con las partes o los hechos.
5. **III. Relato del hecho**: narración libre (renglones en blanco si no se proporciona).
6. **IV. Preguntas y respuestas**: numeradas; 10 (diez) espacios en blanco por defecto.
7. **V. Cierre**: hora de conclusión y constancia de lectura y firma libre y voluntaria.
8. **Firmas**: ENTREVISTADO(A) y ENTREVISTADOR(A), con nombre bajo la línea.
9. **Pie**: "Página X de Y" automático.

Formato: hoja carta, márgenes de 2 (dos) centímetros, Arial 12 (doce) puntos en cuerpo,
etiquetas en azul marino institucional (#0B3D6E), texto justificado, interlineado 1.15.

## Flujo de trabajo

### A. Formato en blanco (para llenar a mano)
Entregar directamente `assets/ENTREVISTA_TESTIGO_PLANTILLA.docx`, o regenerarlo con
otra cantidad de espacios:

```bash
python3 scripts/generar_entrevista.py --salida ENTREVISTA_TESTIGO.docx \
    --preguntas-en-blanco 15 --lineas-relato 20
```

### B. Formato llenado por Claude (total o parcial)
1. **Preguntas aclaratorias previas** (1 a 2): confirmar NUC o número de expediente,
   la calidad del testigo (de cargo, de descargo, de contexto, de referencia) y el
   objetivo probatorio de la entrevista. No inventar datos personales.
2. **Verificar datos** del expediente antes de insertarlos (NUC, nombres completos,
   autoridad). Si un dato no se tiene, dejarlo vacío: el generador imprime la línea
   en blanco.
3. **Preparar las preguntas** conforme a `references/guia-preguntas.md`, vinculando
   cada bloque de preguntas con el hecho que se pretende acreditar o desacreditar.
   Si existe teoría del caso, encadenar con `analisis-caso-defensa` o
   `audiencia-intermedia` para alinear las preguntas con los hechos relevantes.
4. **Construir el JSON** (ver esquema) en el directorio de trabajo y ejecutar:
   ```bash
   python3 scripts/generar_entrevista.py --datos datos.json \
       --salida ENTREVISTA_TESTIGO_<APELLIDO>_<AAAA-MM-DD>.docx
   ```
5. **Revisar** el resultado (convertir a PDF y revisar visualmente si es posible) y
   entregar al usuario.

Si la entrevista ya se realizó (por ejemplo, a partir de notas o de una transcripción
con `transcripcion-audiencias`), capturar el relato y las respuestas **literalmente**,
en primera persona, sin corregir el dicho del testigo ni agregar valoraciones.

## Esquema del JSON

Todos los campos son opcionales; lo que falte queda en blanco.

```json
{
  "nuc": "LPZ/0000/2026",
  "etiqueta_identificador": "NÚMERO ÚNICO DE CAUSA (NUC)",
  "asunto": "",
  "lugar": "",
  "fecha": "AAAA-MM-DD",
  "hora": "HH:MM",
  "hora_conclusion": "HH:MM",
  "entrevistador": "",
  "entrevistado": "",
  "domicilio": "",
  "tiempo_residencia": "",
  "correo": "",
  "edad": 0,
  "media_filiacion": "",
  "apodo": "",
  "sexo": "",
  "telefono": "",
  "ocupacion": "",
  "domicilio_laboral": "",
  "identificacion_tipo": "",
  "identificacion_numero": "",
  "relacion": "",
  "relato": "Párrafos separados por salto de línea",
  "preguntas": [
    {"pregunta": "Texto de la pregunta", "respuesta": "", "lineas_respuesta": 3},
    "También se acepta la pregunta como texto simple"
  ],
  "cierre": "Texto de cierre alternativo (opcional)"
}
```

Conversiones automáticas del generador:
- `fecha` + `hora` → "11:40 (once horas con cuarenta minutos) del 23 (veintitrés) de octubre de 2023 (dos mil veintitrés)".
- `edad` numérica → "56 (cincuenta y seis) años".
- Pregunta sin respuesta → línea de respuesta + renglones en blanco (`lineas_respuesta`, 2 por defecto).

## Reglas del despacho aplicables

- Español de México, correctamente acentuado; sin abreviaturas no declaradas
  (la primera mención va completa y la sigla entre paréntesis).
- Fechas con número y letra en todo documento que se genere llenado.
- **Confidencialidad**: los datos del testigo son datos personales. No reutilizar datos
  de una entrevista en otra ni guardarlos dentro de la skill; los JSON con datos reales
  se crean en el directorio de trabajo del caso, nunca en `scripts/`.
- **Fundamentación**: si se agrega al formato alguna cita de ley (por ejemplo, el
  sustento de la facultad de la defensa o de la asesoría jurídica para entrevistar
  testigos), localizar y transcribir el artículo con `buscador-legislacion-mft`;
  nunca citar de memoria.
- Si la entrevista generará un plazo o actuación (por ejemplo, descubrimiento
  probatorio), advertirlo y encadenar con `descubrimiento-probatorio` y
  `computo-plazos-bcs`.
