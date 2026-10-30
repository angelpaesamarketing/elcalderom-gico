// Carta real, tomada del PDF que nos pasó el restaurante.
// Precios en euros. Si cambian en el local, se cambian aquí.

export const CARTA = [
  {
    grupo: 'Entrantes',
    platos: [
      { nombre: 'Croquetrolls', precio: '11,50', desc: 'Surtido de croquetas caseras de pulled pork, jamón y chorizo picante.' },
      { nombre: 'Alitas de Fénix', precio: '10,50', desc: 'Alitas de pollo a baja temperatura, marinadas y salteadas en salsa de naranja.' },
      { nombre: 'Nachos del Destino', precio: '10,50', desc: 'Nachos caseros con salsa de cheddar, bacon ahumado y jalapeño. Sin gluten y con opción vegana.' },
      { nombre: 'Paapas Smigol', precio: '10,50', desc: 'Patatas fritas caseras con pulled pork y barbacoa de uva.' },
      { nombre: 'Patatas Dracaris', precio: '10,50', desc: 'Patatas fritas caseras con chili con carne. Sin gluten.' },
    ],
  },
  {
    grupo: 'Ensaladas',
    platos: [
      { nombre: 'Ensalada Élfica', precio: '12,60', desc: 'Mezclum con bits de bacon, cherry, manzana, uva, queso y salsa Rivendel.' },
      { nombre: 'Ensalada Herbología', precio: '12,60', desc: 'Mezclum, canónigos, rúcula, jamón crujiente, queso azul y salsa ajo-miel.' },
      { nombre: 'Ensalada Madriguera', precio: '9,50', desc: 'Rúcula con ceviche de tomate rosa, salteado de setas y cebolla caramelizada.' },
    ],
  },
  {
    grupo: 'Principales',
    platos: [
      { nombre: 'Godric', precio: '14,40', desc: 'Ternera del Pirineo en pan de patata rojo, cheddar, bacon ahumado, cebolla caramelizada y salsa Harrys.' },
      { nombre: 'La Innombrable', precio: '14,40', desc: 'Ternera del Pirineo en brioche negro, emmental, jamón crujiente, guacamole y jalapeño.' },
      { nombre: 'Corvo', precio: '14,40', desc: 'Contramuslo rebozado en pan de patata, rulo de cabra, panceta curada y salsa Rowina.' },
      { nombre: 'Huflepork', precio: '14,40', desc: 'Hamburguesa de chorizo en pan de patata, pulled pork y barbacoa de uva casera.' },
      { nombre: 'Patronus', precio: '15,90', desc: 'Hamburguesa de ciervo en brioche negro, rulo de vaca madurado y mermelada de melocotón.' },
      { nombre: 'Comarca', precio: '14,40', desc: 'Hamburguesa de alubias, pimiento y harina de arroz, con rúcula, setas y guacamole.' },
      { nombre: 'Cachopotter', precio: '14,40', desc: 'Cachopo de ternera, jamón de Teruel y queso ahumado.' },
    ],
  },
  {
    grupo: 'Postres',
    platos: [
      { nombre: 'Torrija Umbridge', precio: '5,90', desc: 'Torrija de pan de leche, mermelada de fresa y toffee de manzana.' },
      { nombre: 'Gofre Lix Felicis', precio: '5,90', desc: 'Gofre con galleta lotus, crema de lotus y helado de vainilla.' },
    ],
  },
];

export const BARRA = [
  { nombre: 'Cerveza de mantequilla', precio: '5,00', desc: 'Casera, sin cerveza ni mantequilla. Receta robada a un duende irlandés. Con whisky, vodka, ron o sin alcohol.' },
  { nombre: 'Esencia de Bella Dona', precio: '10,00', desc: 'Midori, vodka, licor de manzana, lima y zumo de manzana. Versión sin alcohol disponible.' },
  { nombre: 'Extracto de Sirena', precio: '10,00', desc: 'Vodka de fresa, lima, curaçao, escamas de sirena y nata. Versión sin alcohol disponible.' },
  { nombre: 'Poción Matalobos', precio: '10,00', desc: 'Ron Kraken, lima y ginger beer. Solo con alcohol.' },
  { nombre: 'Suerte Púrpura', precio: '10,00', desc: 'Poción cambiacolor: ginebra macerada en té de mariposa, tónica y sirope de arándanos.' },
  { nombre: 'El Seleccionador', precio: '10,00', desc: 'Descubre tu casa con el sombrero. Vodka, naranja, licor de frambuesa y polvo seleccionador.' },
];

export const CLASE = {
  conAlcohol: '29,95',
  sinAlcohol: '19,95',
  pociones: [
    'Poción de Resurrección',
    'Poción de Amor',
    'Herbología',
    'Corazón de Dragón',
    'Muerte Instantánea',
  ],
};
