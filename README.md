# Sitio web de Meza Figueroa & Tuchmann, Asociados

Sitio institucional del despacho, publicado en **abogadosbcs.com**.

Es un sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de
compilación. Cualquier servidor de archivos estáticos lo sirve tal cual;
en Vercel se despliega sin configuración adicional (`vercel.json` solo
define direcciones limpias y encabezados de seguridad).

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Página de inicio: portada, áreas de práctica, equipo, cómo trabajamos, consulta por WhatsApp, contacto y mapa. |
| `aviso-de-privacidad.html` | Aviso de Privacidad conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. |
| `assets/styles.css` | Hoja de estilos. |
| `assets/site.js` | Menú móvil, semblanzas, aparición al desplazarse y formulario de WhatsApp. |
| `assets/logo-*.png`, `assets/favicon.png` | Logotipo institucional. |
| `brand/` | Archivo fuente del logotipo (Adobe Illustrator y PDF). |

## Datos del despacho usados en el sitio

| Dato | Valor |
|---|---|
| Nombre | Meza Figueroa & Tuchmann, Asociados |
| Domicilio | Calle Nayarit 1025, Colonia Pueblo Nuevo, C.P. 23060, La Paz, Baja California Sur |
| Teléfono de oficina | 612 146 3512 |
| WhatsApp | 612 348 3418 |
| Correo | meficlientes@gmail.com |
| Instagram | @mftuchmannasociados |
| Horario | Lunes a viernes, de 9:00 a 15:00 horas |

Para cambiar el número de WhatsApp hay que actualizarlo en tres lugares:
la constante `WHATSAPP` de `assets/site.js`, los enlaces `wa.me` de
`index.html` y el Aviso de Privacidad.

## Pendientes de contenido

- Fotografías de los nueve integrantes del equipo (hoy se muestra el monograma).
- Semblanzas de los integrantes (hoy dicen «en preparación»).
- Fotografía profesional de la fachada.
- Versión en inglés.
- Blog.

## Prueba local

```sh
python3 -m http.server 8000
```

y abrir <http://localhost:8000>.
