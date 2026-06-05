# Buscador Penal MX

Herramienta de búsqueda integrada del **Código Nacional de Procedimientos Penales (CNPP)** vigente, con módulo de **jurisprudencia y precedentes de la SCJN y de la Corte IDH**, para investigación, redacción y litigio penal en México.

- **PWA** (instalable en escritorio y celular, funciona offline).
- **Citas con fuente obligatoria** — sin URL verificable la entrada no se muestra.
- **Historial de reforma del CNPP** con *diff* lado a lado entre la redacción vigente y la anterior.
- **Búsqueda léxica + sinónimos jurídicos** (`derecho a no autoincriminarse` ≈ `no declarar contra sí mismo`).
- **Modo audiencia**, copia de citas, cuaderno de caso, calculadora de plazos, plantillas de escritos.
- **Actualización semanal automática** (cron de viernes) desde Cámara de Diputados, SJF y CorteIDH.

## Stack

- React + Vite + Tailwind
- Fuse.js (búsqueda léxica con tolerancia a errores)
- vite-plugin-pwa (Workbox, caché offline)
- Scrapers en Node (sin dependencias externas)

## Estructura

```
public/data/
  cnpp.json           # 490 artículos del CNPP vigente + historial de reformas
  precedentes.json    # Tesis SJF + ejecutorias (sistema constitucional de precedentes)
  compendios.json     # Cuadernos de jurisprudencia SCJN + obras BJV-UNAM (PDFs oficiales)
  manifest.json
scripts/
  build/parse_cnpp.mjs   # Convierte .doc/.txt oficiales a JSON estructurado
  build/verify.mjs       # Integridad (anti-alucinación)
  ingest/cnpp.mjs        # Descarga semanal desde diputados.gob.mx
  ingest/sjf.mjs         # Scraper SCJN — tesis + ejecutoria de cada tesis
  ingest/cidh.mjs        # Scraper CorteIDH
  ingest/compendios.mjs  # Descarga PDFs SCJN/UNAM y extrae texto con pdftotext
src/
  App.jsx / components / lib
```

### Categorías de fuentes

| Categoría    | Qué es                                                            | Uso típico                                   |
|--------------|-------------------------------------------------------------------|----------------------------------------------|
| CNPP         | Artículos del Código vigente con historial de reforma             | Fundar y citar normas procesales             |
| Precedente   | Tesis/jurisprudencia individual SCJN + su ejecutoria              | Sustentar criterio vinculante (art. 94 CPEUM)|
| Compendio    | Cuadernos de Jurisprudencia SCJN, Tomos BJV-UNAM (PDFs)           | Investigación temática y argumentación       |

## Desarrollo local

```bash
npm install
npm run dev
```

Para reconstruir el dataset CNPP desde nuevas versiones oficiales:

```bash
# 1) Convierte los .doc (Cámara de Diputados) a .txt
sudo apt install -y catdoc            # o brew install catdoc
mkdir -p /tmp/cnpp_txt
for f in path/al/*.doc; do
  catdoc -d utf-8 "$f" > /tmp/cnpp_txt/$(basename "$f" .doc).txt
done

# 2) Genera public/data/cnpp.json
node scripts/build/parse_cnpp.mjs /tmp/cnpp_txt

# 3) Verifica
npm run verify
```

## Datos verificados

El dataset CNPP de esta release procesó 5 versiones históricas oficiales (Cámara de Diputados):

- 2016-06-17 · 2021-02-19 · 2024-01-26 · 2024-12-16 · **2025-11-28 (vigente)**

Cada artículo conserva:
- Texto íntegro con su ubicación (Libro › Título › Capítulo › Sección).
- `history`: redacciones anteriores con su fecha DOF de origen — habilita el comparador.
- `source_url` → `https://www.diputados.gob.mx/LeyesBiblio/ref/cnpp.htm`.

## Actualización semanal

`.github/workflows/weekly-update.yml` corre cada **viernes 06:00 CDMX**:

1. Descarga el .doc/PDF vigente desde diputados.gob.mx.
2. Reconvierte y re-parsea — si la versión cambió, los artículos nuevos quedan con `history`.
3. Llama a los scrapers de SJF y CorteIDH para enriquecer `precedentes.json`.
4. Pasa `verify` (no permite entradas sin URL fuente).
5. Abre un **pull request** con los cambios para revisión humana (nunca push directo a `main`).

## Despliegue (GitHub Pages)

1. En *Settings → Pages* del repo, elegir **Source: GitHub Actions**.
2. Configurar la variable de repo `VITE_BASE = /Abogadosbcs/` (si el sitio vive en un subpath de Pages).
3. `git push origin main` — el workflow `deploy.yml` construye y publica.

## Garantías de integridad

- **Anti-alucinación**: el cargador filtra cualquier precedente sin `source_url` HTTPS. El verificador hace fallar el build si detecta entradas con texto muy corto o sin fuente.
- **Sin servidor**: 100% estático, sin telemetría, sin sincronización a la nube. El cuaderno de caso vive en `localStorage`.
- **Auditoría**: `scripts/build/verify.mjs` registra contadores y el `metadata.versions_processed` deja constancia de qué archivos alimentaron el dataset.

## Roadmap

- Búsqueda semántica con `@xenova/transformers` (MiniLM-multilingual) ejecutándose en el navegador, sin servidor.
- Importación automática del texto íntegro de sentencias CorteIDH (PDFs).
- Mapeo cruzado: vista "Mostrar todos los precedentes que aplican el Art. N" disparada desde la ficha del artículo.
- Exportación a DOCX/PDF formateado para tribunal.

## Licencia y aviso legal

Las fuentes oficiales (CNPP, tesis SCJN, sentencias CorteIDH) son del dominio público y este proyecto las redistribuye con su URL canónica. La herramienta es de apoyo para investigación; **no sustituye** la consulta directa en la fuente oficial antes de citar en un escrito o audiencia.
