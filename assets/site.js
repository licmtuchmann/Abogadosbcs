/* Comportamiento del sitio: menú móvil, semblanzas, aparición al desplazarse
   y formulario de consulta por WhatsApp. Sin dependencias externas. */
(function () {
  "use strict";

  var WHATSAPP = "526123483418"; // 612 348 3418, número de WhatsApp del despacho

  /* Menú móvil ----------------------------------------------------------- */
  var botonMenu = document.querySelector(".boton-menu");
  var menu = document.getElementById("menu");
  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", String(abierto));
    });
    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menu.classList.remove("abierto");
        botonMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Sombra del encabezado y sección activa ------------------------------- */
  var encabezado = document.querySelector(".encabezado");
  var enlacesMenu = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var secciones = enlacesMenu
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function alDesplazar() {
    if (encabezado) encabezado.classList.toggle("con-sombra", window.scrollY > 8);
    var actual = null;
    secciones.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 120) actual = s.id;
    });
    enlacesMenu.forEach(function (a) {
      a.classList.toggle("activo", a.getAttribute("href") === "#" + actual);
    });
  }
  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();

  /* Aparición al desplazarse --------------------------------------------- */
  var reveladores = document.querySelectorAll(".revelar, .emblema");
  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observador.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveladores.forEach(function (el) { observador.observe(el); });
  } else {
    reveladores.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Semblanzas (ventanas emergentes) ------------------------------------- */
  document.querySelectorAll("[data-abrir]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      var dialogo = document.getElementById(boton.dataset.abrir);
      if (!dialogo) return;
      if (typeof dialogo.showModal === "function") dialogo.showModal();
      else dialogo.setAttribute("open", "");
      try { history.replaceState(null, "", "#" + boton.dataset.abrir.replace("sem-", "")); } catch (e) { /* sin historial */ }
    });
  });
  document.querySelectorAll("dialog.semblanza").forEach(function (dialogo) {
    var cerrar = dialogo.querySelector("[data-cerrar]");
    if (cerrar) cerrar.addEventListener("click", function () { dialogo.close(); });
    dialogo.addEventListener("click", function (ev) { if (ev.target === dialogo) dialogo.close(); });
    dialogo.addEventListener("close", function () {
      try { history.replaceState(null, "", location.pathname + "#equipo"); } catch (e) { /* sin historial */ }
    });
  });
  var hash = location.hash.slice(1);
  var semblanzaInicial = hash && document.getElementById("sem-" + hash);
  if (semblanzaInicial && typeof semblanzaInicial.showModal === "function") semblanzaInicial.showModal();

  /* Formulario de consulta: arma el mensaje y abre WhatsApp -------------- */
  var formulario = document.getElementById("form-consulta");
  if (formulario) {
    formulario.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var error = formulario.querySelector(".error");
      var nombre = formulario.elements.nombre.value.trim();
      var materia = formulario.elements.materia.value;
      var mensaje = formulario.elements.mensaje.value.trim();
      var aviso = formulario.elements.aviso.checked;

      if (!nombre || !materia || !mensaje || !aviso) {
        error.textContent = "Complete todos los campos y acepte el Aviso de Privacidad.";
        error.hidden = false;
        return;
      }
      error.hidden = true;

      var texto =
        "Hola, solicito una consulta.\n\n" +
        "*Nombre completo:* " + nombre + "\n" +
        "*Materia:* " + materia + "\n" +
        "*Asunto:* " + mensaje;

      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }

  /* Año del pie de página ------------------------------------------------ */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
