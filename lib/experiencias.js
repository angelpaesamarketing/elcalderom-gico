// Lo que vende el local además de la carta. Precios y condiciones tomados
// de elcalderomagico.com y de su carta en PDF.

export const CLASE = {
  adultos: '29,95',
  menores: '19,95',
  datos: [
    ['Duración', '1 h 45 min'],
    ['Incluye', '3 cócteles, túnica y varita'],
    ['Versión', 'Con o sin alcohol'],
    ['Menores', 'Siempre con un adulto'],
  ],
  // Las cinco pociones entre las que el grupo elige dos. El color es el del
  // cóctel servido: tiñe la copa del selector y el caldero.
  pociones: [
    {
      id: 'resurreccion',
      nombre: 'Poción de Resurrección',
      color: '#12cfc0',
      brillo: '#8ff5ec',
      nota: 'Tropical y fresca. La que levanta a un muerto.',
      desc: 'Ron, malibú, curaçao, zumo de piña y ojos de troll.',
    },
    {
      id: 'amor',
      nombre: 'Poción de Amor',
      color: '#ff3f93',
      brillo: '#ffa3cb',
      nota: 'Floral, cítrica y cambia de color ante tus ojos.',
      desc: 'Ginebra con té de mariposa, tónica, limón, sirope de chicle y polvo de amor.',
    },
    {
      id: 'herbologia',
      nombre: 'Herbología',
      color: '#35d466',
      brillo: '#a0f5b8',
      nota: 'Dulce y suave, con vainilla y fresa.',
      desc: 'Vodka, lima, sirope de vainilla y sirope de fresa.',
    },
    {
      id: 'dragon',
      nombre: 'Corazón de Dragón',
      color: '#ff5417',
      brillo: '#ffb07a',
      nota: 'Especiada y cálida. Canela, miel y carácter.',
      desc: 'Whisky con canela, manzana, naranja sanguina y miel.',
    },
    {
      id: 'muerte',
      nombre: 'Muerte Instantánea',
      color: '#8a3bff',
      brillo: '#c9a5ff',
      nota: 'Ácida y afrutada. Entra suave y pega fuerte.',
      desc: 'Vodka, licor de melón, lima, manzana y licor de manzana.',
    },
  ],
};

export const POCION = Object.fromEntries(CLASE.pociones.map((p) => [p.id, p]));
export const MAX_POCIONES = 2;

export const CHOCOLATEADAS = {
  precio: '12',
  datos: [
    ['Duración', '1 hora'],
    ['Incluye', 'Gofre, túnica y varita'],
    ['Para', 'Adultos y peques'],
  ],
  desc: 'Crea tu propio chocolate caliente en un caldero: eliges la base —negro, rosa o blanco—, los sabores y los toppings.',
};

export const EVENTOS = [
  { nombre: 'Cumpleaños', desc: 'Con clase de pociones, chocolateadas o solo cena. Para peques y para no tan peques.' },
  { nombre: 'Team building', desc: 'Vuestro equipo con túnica, compitiendo por la mejor poción. Mejor que otra cena de empresa.' },
  { nombre: 'Despedidas', desc: 'De soltero, de soltera o de quien se va de Erasmus.' },
  { nombre: 'Eventos privados', desc: 'El local para vosotros. Si sois más de diez, lo preparamos a medida.' },
];

export const TRIVIAL = {
  dia: 'Todos los miércoles',
  datos: [
    ['Tema', 'Uno nuevo cada semana'],
    ['Equipos', 'De 4, o ven por libre'],
    ['Duración', 'De 1 h a 1 h 30'],
    ['Premio', 'Para el equipo ganador'],
  ],
};

// Qué se puede reservar o comprar, y por dónde va cada cosa:
//  - 'reservas' y 'tienda' abren el módulo de CoverManager del local, con
//    disponibilidad y pago reales;
//  - 'solicitud' es para lo que el local gestiona hablando: grupos y eventos.
// Cada tipo trae su ficha: antes de reservar, el cliente ve en qué consiste
// lo que va a reservar.
export const TIPOS_RESERVA = [
  {
    id: 'mesa',
    nombre: 'Mesa',
    pista: 'Comida o cena',
    via: 'reservas',
    ficha: {
      titulo: 'Una mesa para comer o cenar',
      datos: [
        ['Miércoles y jueves', '18:00 – 00:00'],
        ['Viernes y sábado', '12:00 – 01:30'],
        ['Domingo', '12:00 – 00:00'],
        ['Lunes y martes', 'Cerrado'],
      ],
      puntos: [
        'Hamburguesas, entrantes y postres de la carta, con opciones sin gluten y veganas.',
        'Cócteles y cerveza de mantequilla en la mesa.',
        'Esta reserva es solo de mesa. La clase de pociones es otra experiencia y se reserva aparte.',
      ],
      continuar: 'Reservar mesa',
    },
  },
  {
    id: 'clase',
    nombre: 'Clase de pociones',
    pista: '29,95 € · 1 h 45',
    via: 'reservas',
    aviso: 'En el desplegable de la reserva, elige «Curso homologado del ministerio mágico».',
    ficha: {
      titulo: 'Una clase de coctelería en tu propio caldero',
      datos: [
        ['Adultos', '29,95 €'],
        ['Menores, sin alcohol', '19,95 €'],
        ['Duración', '1 h 45 min'],
        ['Versión', 'Con o sin alcohol'],
      ],
      puntos: [
        'Empezáis con el Seleccionador: el sombrero decide vuestra casa.',
        'Después preparáis dos pociones en vuestro caldero, guiados por los profesores.',
        'Túnica para cada uno y varita para el grupo durante toda la clase.',
        'Son tres cócteles por persona. No incluye comida: si queréis cenar, reservad también mesa.',
      ],
      continuar: 'Reservar la clase',
    },
  },
  {
    id: 'chocolate',
    nombre: 'Chocolateadas',
    pista: '12 € · 1 h',
    via: 'reservas',
    aviso: 'En el desplegable de la reserva, elige las chocolateadas.',
    ficha: {
      titulo: 'Tu propio chocolate caliente, hecho en caldero',
      datos: [
        ['Por persona', '12 €'],
        ['Duración', '1 hora'],
        ['Para', 'Adultos y peques'],
        ['Alcohol', 'No lleva'],
      ],
      puntos: [
        'Eliges la base —chocolate negro, rosa o blanco—, los sabores y los toppings.',
        'Incluye un gofre, túnica y varita.',
        'Pensada para familias: no hay edad mínima.',
      ],
      continuar: 'Reservar chocolateadas',
    },
  },
  {
    id: 'regalo',
    nombre: 'Tarjeta regalo',
    pista: 'Se paga aquí mismo',
    via: 'tienda',
    ficha: {
      titulo: 'Regala una tarde de magia',
      puntos: [
        'Eliges la experiencia que quieres regalar en la tienda del local.',
        'La pagas en el momento, con tarjeta.',
        'Quien la recibe reserva su día cuando quiera.',
      ],
      continuar: 'Ir a la tienda',
    },
  },
  { id: 'evento', nombre: 'Evento o grupo', pista: 'Cumples, empresa, +10', via: 'solicitud' },
];
