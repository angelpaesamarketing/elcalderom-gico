// Datos del local. Dirección y horario tomados de la página de contacto
// de elcalderomagico.com.
export const LOCAL = {
  calle: 'Calle Jordán de Urriés, 6-8',
  ciudad: 'Casco Antiguo, Zaragoza',
  telefono: '624 226 793',
  telefonoEnlace: 'tel:+34624226793',
  mapa: 'https://www.google.com/maps/search/?api=1&query=El+Caldero+M%C3%A1gico+Calle+Jord%C3%A1n+de+Urri%C3%A9s+6+Zaragoza',
  // Dónde lleva todo botón de reservar. Hoy es el teléfono; en cuanto haya
  // enlace del sistema de reservas se cambia aquí y cambia en toda la web.
  reservar: 'tel:+34624226793',
  horario: [
    { dias: 'Lunes y martes', horas: 'Cerrado', cerrado: true },
    { dias: 'Miércoles y jueves', horas: '18:00 – 00:00' },
    { dias: 'Viernes y sábado', horas: '12:00 – 01:30' },
    { dias: 'Domingo', horas: '12:00 – 00:00' },
  ],
};
