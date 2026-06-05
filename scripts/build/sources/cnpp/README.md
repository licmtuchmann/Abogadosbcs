# Fuentes históricas del CNPP

Versiones del Código Nacional de Procedimientos Penales en texto plano,
extraídas de los `.doc` oficiales de Cámara de Diputados.

## Estructura

- `primary/` — versiones convertidas con `catdoc` (UTF-8). Es el set base.
- `fallback/` — versiones convertidas con `antiword`. Se usa solo para parchar
  artículos donde `catdoc` perdió texto (un caso conocido: art. 265 en la
  versión 2025-11-28).

## Naming

`cnpp_YYYY-MM-DD.txt` donde la fecha es el **DOF de la última reforma** que
incorpora esa versión. Coincide exactamente con el `vigente_dof` que el
parser registra para cada snapshot.

## Por qué viven aquí

El parser (`scripts/build/parse_cnpp.mjs`) compara TODAS estas versiones para
generar el campo `history` por artículo. Sin estas fuentes, el feature de
"redacción anterior vs vigente" se pierde y solo queda la versión más nueva.

## Cómo agregar una versión nueva

1. Descargar el `.doc` oficial desde
   <https://www.diputados.gob.mx/LeyesBiblio/ref/cnpp.htm>
   (o el workflow `weekly-update.yml` lo hace solo).
2. Convertir:
   ```
   catdoc -d utf-8 CNPP.doc > primary/cnpp_YYYY-MM-DD.txt
   antiword -m UTF-8.txt CNPP.doc > fallback/cnpp_YYYY-MM-DD.txt
   ```
3. Correr el parser:
   ```
   node scripts/build/parse_cnpp.mjs scripts/build/sources/cnpp/primary scripts/build/sources/cnpp/fallback public/data/cnpp.json
   ```
4. Verificar con `npm run verify`.

## No son canónicos

El texto que vincula jurídicamente es el publicado en el DOF y, por
referencia consolidada, el `.doc` oficial de diputados.gob.mx. Estas
conversiones .txt son auxiliares para alimentar el buscador. El campo
`source_url` en `cnpp.json` siempre apunta a la fuente oficial vigente.
