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
  pociones: [
    { id: 'resurreccion', nombre: 'Poción de Resurrección', desc: 'Ron, malibú, curaçao, zumo de piña y ojos de troll.' },
    { id: 'amor', nombre: 'Poción de Amor', desc: 'Ginebra con té de mariposa, tónica, limón, sirope de chicle y polvo de amor.' },
    { id: 'herbologia', nombre: 'Herbología', desc: 'Vodka, lima, sirope de vainilla y sirope de fresa.' },
    { id: 'dragon', nombre: 'Corazón de Dragón', desc: 'Whisky con canela, manzana, naranja sanguina y miel.' },
    { id: 'muerte', nombre: 'Muerte Instantánea', desc: 'Vodka, licor de melón, lima, manzana y licor de manzana.' },
  ],
};

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
export const TIPOS_RESERVA = [
  { id: 'mesa', nombre: 'Mesa', pista: 'Comida o cena', via: 'reservas' },
  {
    id: 'clase',
    nombre: 'Clase de pociones',
    pista: '29,95 € · 1 h 45',
    via: 'reservas',
    aviso: 'Para la clase, elige «Curso homologado del ministerio mágico» en el desplegable.',
  },
  {
    id: 'chocolate',
    nombre: 'Chocolateadas',
    pista: '12 € · 1 h',
    via: 'reservas',
    aviso: 'Elige las chocolateadas en el desplegable de la reserva.',
  },
  { id: 'regalo', nombre: 'Tarjeta regalo', pista: 'Se paga aquí mismo', via: 'tienda' },
  { id: 'evento', nombre: 'Evento o grupo', pista: 'Cumples, empresa, +10', via: 'solicitud' },
];
