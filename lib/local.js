// Datos del local. Dirección, horario, teléfono y correo tomados de la
// página de contacto de elcalderomagico.com.
export const LOCAL = {
  nombre: 'El Caldero Mágico',
  calle: 'Calle Jordán de Urriés, 6-8',
  ciudad: 'Casco Antiguo, Zaragoza',
  cp: '50001',
  telefono: '624 226 793',
  telefonoEnlace: 'tel:+34624226793',
  // El teléfono es un móvil: las solicitudes salen por WhatsApp a ese número.
  // Si el local no lo usa en WhatsApp, basta con vaciar este campo y la web
  // se queda con correo y llamada.
  whatsapp: '34624226793',
  correo: 'info@elcalderomagico.com',
  instagram: 'https://www.instagram.com/elcalderomagico.zaragoza/',
  instagramNombre: '@elcalderomagico.zaragoza',
  web: 'https://elcalderomagico.com',
  mapa: 'https://www.google.com/maps/search/?api=1&query=El+Caldero+M%C3%A1gico+Calle+Jord%C3%A1n+de+Urri%C3%A9s+6+Zaragoza',
  horario: [
    { dias: 'Lunes y martes', horas: 'Cerrado', cerrado: true },
    { dias: 'Miércoles y jueves', horas: '18:00 – 00:00' },
    { dias: 'Viernes y sábado', horas: '12:00 – 01:30' },
    { dias: 'Domingo', horas: '12:00 – 00:00' },
  ],
  // Apertura por día de la semana (0 = domingo), para el formulario de
  // reserva: primera y última hora a la que tiene sentido pedir mesa.
  apertura: {
    0: ['12:00', '22:30'],
    3: ['18:00', '22:30'],
    4: ['18:00', '22:30'],
    5: ['12:00', '23:30'],
    6: ['12:00', '23:30'],
  },
};
