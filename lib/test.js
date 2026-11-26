// El Seleccionador: cinco preguntas y el sombrero te manda a una casa.
// Cada respuesta suma a una casa; el caldero se tiñe del color de esa casa.
// Los nombres de las casas viven solo en este archivo.

export const CASAS = {
  gryffindor: {
    nombre: 'Gryffindor',
    color: '#d3232e',
    brillo: '#ffb347',
    lema: 'Primero saltas. Luego ya miras si había agua.',
    perfil: 'Valiente hasta la imprudencia y leal hasta el final. Eres quien se levanta cuando nadie más lo hace, quien propone el plan y quien paga la primera ronda.',
    pociones: ['dragon', 'resurreccion'],
  },
  hufflepuff: {
    nombre: 'Hufflepuff',
    color: '#f2b705',
    brillo: '#ffe08a',
    lema: 'Contigo todo el mundo está a gusto.',
    perfil: 'Paciente, justo y trabajador. No necesitas ser el centro de la mesa porque eres quien la sostiene. Y siempre sabes dónde se come bien.',
    pociones: ['herbologia', 'amor'],
  },
  ravenclaw: {
    nombre: 'Ravenclaw',
    color: '#2f6fe4',
    brillo: '#9cc2ff',
    lema: 'Ya lo habías pensado antes de que lo dijeran.',
    perfil: 'Curiosidad sin fondo e ingenio rápido. Te sabes el dato, la excepción al dato y la anécdota del que lo descubrió. Las normas te interesan sobre todo para entender por qué existen.',
    pociones: ['amor', 'muerte'],
  },
  slytherin: {
    nombre: 'Slytherin',
    color: '#17a35b',
    brillo: '#8ef0b6',
    lema: 'No es ambición. Es tener claro lo que quieres.',
    perfil: 'Astuto, decidido y con un plan B para el plan B. Eliges bien a los tuyos y los defiendes sin preguntar. Si entras a un sitio, sales con lo que venías a buscar.',
    pociones: ['muerte', 'dragon'],
  },
};

const r = (texto, casa) => ({ texto, casa });

export const PREGUNTAS = [
  {
    texto: 'Encuentras una puerta que no debería estar ahí.',
    respuestas: [
      r('La abro. Para eso está', 'gryffindor'),
      r('Aviso a los demás y entramos juntos', 'hufflepuff'),
      r('Primero averiguo qué hay detrás', 'ravenclaw'),
      r('Entro solo y luego decido a quién se lo cuento', 'slytherin'),
    ],
  },
  {
    texto: '¿Qué prefieres que digan de ti?',
    respuestas: [
      r('Que no me achanté', 'gryffindor'),
      r('Que se podía contar conmigo', 'hufflepuff'),
      r('Que casi siempre tenía razón', 'ravenclaw'),
      r('Que llegué donde dije que llegaría', 'slytherin'),
    ],
  },
  {
    texto: 'Examen mañana y no has abierto el libro.',
    respuestas: [
      r('Improviso. Peores las he pasado', 'gryffindor'),
      r('Quedo con alguien y lo sacamos a medias', 'hufflepuff'),
      r('Imposible: lo llevo leído desde hace un mes', 'ravenclaw'),
      r('Consigo las preguntas del año pasado', 'slytherin'),
    ],
  },
  {
    texto: 'Elige compañía para una noche larga.',
    respuestas: [
      r('Un fuego y una buena historia', 'gryffindor'),
      r('Una mesa llena y algo recién hecho', 'hufflepuff'),
      r('Una torre, un libro y que llueva fuera', 'ravenclaw'),
      r('Un sillón de cuero y una conversación a media voz', 'slytherin'),
    ],
  },
  {
    texto: 'Te dejan elegir un solo objeto.',
    respuestas: [
      r('Una espada', 'gryffindor'),
      r('Una copa que nunca se vacía', 'hufflepuff'),
      r('Un cuaderno con todas las respuestas', 'ravenclaw'),
      r('Un anillo que abre puertas', 'slytherin'),
    ],
  },
];

// En caso de empate gana la casa de la respuesta más reciente: es el color
// que el caldero está enseñando, y así el veredicto no desentona.
export function resultado(respuestas) {
  const puntos = {};
  respuestas.forEach((x) => {
    puntos[x.casa] = (puntos[x.casa] ?? 0) + 1;
  });
  const maximo = Math.max(...Object.values(puntos));
  return [...respuestas].reverse().find((x) => puntos[x.casa] === maximo).casa;
}
