'use client';

import { useState } from 'react';
import Letras from '@/components/Letras';
import { CLASE } from '@/lib/experiencias';
import { LOCAL } from '@/lib/local';
import { medir } from '@/lib/medir';
import { POCIONES, PREGUNTAS, pocionDe, resultado } from '@/lib/test';

// "¿Qué poción eres?". Cada respuesta tiñe el caldero y lanza una onda; al
// final sale una de las cinco pociones de la clase, lista para compartir.
// `reto` es la poción de quien te ha mandado el enlace, si vienes de uno.
export default function Test({ alTeñir, alReservar, reto }) {
  const [respuestas, setRespuestas] = useState([]);
  const [copiado, setCopiado] = useState(false);

  const paso = respuestas.length;
  const terminado = paso === PREGUNTAS.length;
  const id = terminado ? resultado(respuestas) : null;
  const pocion = id ? POCIONES[id] : null;

  const responder = (respuesta) => {
    const siguientes = [...respuestas, respuesta];
    setRespuestas(siguientes);

    const final = siguientes.length === PREGUNTAS.length;
    alTeñir(final ? resultado(siguientes) : pocionDe(respuesta));
    if (final) medir('test_terminado', { pocion: resultado(siguientes) });
  };

  const repetir = () => {
    setRespuestas([]);
    setCopiado(false);
    alTeñir(null);
  };

  const compartir = async () => {
    const url = `${window.location.origin}${window.location.pathname}?pocion=${id}`;
    const texto = `Me ha salido ${pocion.nombre} en El Caldero Mágico: «${pocion.lema}» ¿Y tú qué poción eres?`;
    medir('test_compartido', { pocion: id });

    if (navigator.share) {
      try {
        await navigator.share({ title: '¿Qué poción eres?', text: texto, url });
        return;
      } catch {
        // si cancela el diálogo, se queda como estaba
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${texto} ${url}`);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  if (pocion) {
    return (
      <div className="test" style={{ '--acento': pocion.color }}>
        <span className="antetitulo">Tu poción es</span>
        <h2 key={id}>
          <Letras texto={pocion.nombre} retardo={0.5} paso={0.03} />
        </h2>
        <p className="test-lema">{pocion.lema}</p>
        <p className="entrada">{pocion.perfil}</p>

        <div className="grupo">
          <h3>Lo que lleva</h3>
          <p className="nota">{pocion.receta} También en versión sin alcohol.</p>
          <p className="nota">
            La preparas tú, con túnica y varita, en la clase de pociones: {CLASE.adultos} € por
            persona.
          </p>
        </div>

        <div className="test-acciones">
          <button className="boton boton-lleno" type="button" onClick={() => alReservar(pocion.nombre)}>
            Quiero prepararla
          </button>
          <button className="boton" type="button" onClick={compartir}>
            {copiado ? 'Enlace copiado' : 'Compartir mi poción'}
          </button>
        </div>

        <button className="volver" type="button" onClick={repetir}>
          Repetir el test
        </button>
      </div>
    );
  }

  const pregunta = PREGUNTAS[paso];

  return (
    <div className="test">
      <span className="antetitulo">
        ¿Qué poción eres? · {paso + 1} de {PREGUNTAS.length}
      </span>

      {paso === 0 && reto && POCIONES[reto] && (
        <p className="test-reto">
          A quien te lo ha mandado le salió <strong>{POCIONES[reto].nombre}</strong>. A ver tú.
        </p>
      )}

      <h2 key={paso}>
        <Letras texto={pregunta.texto} retardo={0.1} paso={0.016} />
      </h2>

      <div className="test-barra" aria-hidden="true">
        {PREGUNTAS.map((_, i) => (
          <span key={i} data-hecho={i < paso} data-actual={i === paso} />
        ))}
      </div>

      <div className="test-respuestas" key={`r-${paso}`}>
        {pregunta.respuestas.map((respuesta, i) => (
          <button
            key={respuesta.texto}
            type="button"
            style={{ '--retardo': `${0.35 + i * 0.07}s`, '--tinte': POCIONES[pocionDe(respuesta)].color }}
            onClick={() => responder(respuesta)}
          >
            {respuesta.texto}
          </button>
        ))}
      </div>

      <p className="nota">
        Tres preguntas. El caldero cambia con cada respuesta —{' '}
        <a href={LOCAL.instagram} target="_blank" rel="noreferrer">
          enséñanos qué te sale
        </a>
        .
      </p>
    </div>
  );
}
