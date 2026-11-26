// Deja cada acción que importa en dataLayer. Hoy no hay nadie escuchando;
// el día que se conecte Google Tag Manager o GA4, las reservas, las
// aperturas de sección y los tests terminados ya llegan con nombre.
export function medir(evento, datos = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...datos });
}
