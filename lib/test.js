// "¿Qué poción eres?": tres preguntas y sale una de las cinco pociones que
// se preparan en la clase. Cada respuesta suma puntos a una o dos pociones
// y tiñe el caldero del color de la que más empuja.

export const POCIONES = {
  resurreccion: {
    nombre: 'Poción de Resurrección',
    color: '#12cfc0',
    brillo: '#8ff5ec',
    lema: 'Te caes siete veces y te levantas ocho.',
    perfil: 'Eres el plan que se alarga, la risa que se oye desde la barra y quien convence a todos de quedarse a la última. Tropical por fuera, incombustible por dentro.',
    receta: 'Ron, malibú, curaçao, zumo de piña y ojos de troll.',
  },
  amor: {
    nombre: 'Poción de Amor',
    color: '#ff3f93',
    brillo: '#ffa3cb',
    lema: 'Nadie sale ileso de una mesa contigo.',
    perfil: 'Detallista, intenso y un poco peligroso. Cambias de color según quién te mire y sabes exactamente lo que haces cuando sonríes así.',
    receta: 'Ginebra con té de mariposa, tónica, limón, sirope de chicle y polvo de amor.',
  },
  herbologia: {
    nombre: 'Herbología',
    color: '#35d466',
    brillo: '#a0f5b8',
    lema: 'La calma también es un superpoder.',
    perfil: 'Mientras todos corren, tú riegas las plantas. Dulce sin empalagar, de sobremesas largas y de saber escuchar. Quien te prueba, repite.',
    receta: 'Vodka, lima, sirope de vainilla y sirope de fresa.',
  },
  dragon: {
    nombre: 'Corazón de Dragón',
    color: '#ff5417',
    brillo: '#ffb07a',
    lema: 'Fuego lento, pero fuego.',
    perfil: 'Carácter, canela y cero paciencia para las medias tintas. Proteges a los tuyos con los dientes y calientas cualquier noche de invierno.',
    receta: 'Whisky con canela, manzana, naranja sanguina y miel.',
  },
  muerte: {
    nombre: 'Muerte Instantánea',
    color: '#8a3bff',
    brillo: '#c9a5ff',
    lema: 'Tu humor no es negro: es azabache.',
    perfil: 'Dices lo que los demás piensan y te quedas tan ancho. Entras suave, pegas fuerte y nadie te ve venir. Imposible de olvidar.',
    receta: 'Vodka, licor de melón, lima, manzana y licor de manzana.',
  },
};

export const PREGUNTAS = [
  {
    texto: 'Es sábado por la noche. ¿Cuál es tu plan?',
    respuestas: [
      { texto: 'Bailar hasta que enciendan las luces', suma: { resurreccion: 2, dragon: 1 } },
      { texto: 'Cena para dos y sobremesa larga', suma: { amor: 2, herbologia: 1 } },
      { texto: 'Manta, peli y que nadie me llame', suma: { herbologia: 2, muerte: 1 } },
      { texto: 'Algo que mañana no pueda contar', suma: { muerte: 2, dragon: 1 } },
    ],
  },
  {
    texto: 'Echa un ingrediente al caldero.',
    respuestas: [
      { texto: 'Canela y una chispa', suma: { dragon: 2 } },
      { texto: 'Pétalos y purpurina', suma: { amor: 2 } },
      { texto: 'Hojas recién cortadas', suma: { herbologia: 2 } },
      { texto: 'Fruta de una isla lejana', suma: { resurreccion: 2 } },
      { texto: 'Lo que brille en la oscuridad', suma: { muerte: 2 } },
    ],
  },
  {
    texto: 'Te conceden un poder. ¿Con cuál te quedas?',
    respuestas: [
      { texto: 'Volver a empezar las veces que haga falta', suma: { resurreccion: 2 } },
      { texto: 'Que nadie pueda resistirse a mí', suma: { amor: 2 } },
      { texto: 'Hablar con las plantas', suma: { herbologia: 2 } },
      { texto: 'Escupir fuego', suma: { dragon: 2 } },
      { texto: 'Una mirada que fulmina', suma: { muerte: 2 } },
    ],
  },
];

// La poción que más empuja una respuesta: de ahí sale el color del caldero.
export function pocionDe(respuesta) {
  return Object.entries(respuesta.suma).sort((a, b) => b[1] - a[1])[0][0];
}

// En caso de empate gana la de la respuesta más reciente: es la que el
// caldero está enseñando en ese momento, y así el resultado no sorprende.
export function resultado(respuestas) {
  const puntos = {};
  respuestas.forEach((r) => {
    Object.entries(r.suma).forEach(([id, n]) => {
      puntos[id] = (puntos[id] ?? 0) + n;
    });
  });
  const maximo = Math.max(...Object.values(puntos));
  const ultimas = [...respuestas].reverse().map(pocionDe);
  return ultimas.find((id) => puntos[id] === maximo) ?? Object.keys(puntos).find((id) => puntos[id] === maximo);
}
