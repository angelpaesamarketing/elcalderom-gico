'use client';

import { useState } from 'react';
import Letras from '@/components/Letras';
import { POCION } from '@/lib/experiencias';
import { medir } from '@/lib/medir';
import { CASAS, PREGUNTAS, resultado } from '@/lib/test';

// El Seleccionador: cinco preguntas y sale tu casa. Cada respuesta tiñe el
// caldero del color de la casa hacia la que empuja y lanza una onda. El
// veredicto trae las dos pociones de la casa y lleva a reservar la clase
// con ellas ya elegidas. `reto` es la casa de quien te mandó el enlace.
export default function Test({ alTeñir, alReservar, reto }) {
  const [respuestas, setRespuestas] = useState([]);
  const [copiado, setCopiado] = useState(false);

  const paso = respuestas.length;
  const terminado = paso === PREGUNTAS.length;
  const id = terminado ? resultado(respuestas) : null;
  const casa = id ? CASAS[id] : null;

  const color = (clave) => ({ potion: CASAS[clave].color, glow: CASAS[clave].brillo });

  const responder = (respuesta) => {
    const siguientes = [...respuestas, respuesta];
    setRespuestas(siguientes);

    const final = siguientes.length === PREGUNTAS.length;
    alTeñir(color(final ? resultado(siguientes) : respuesta.casa));
    if (final) medir('test_terminado', { casa: resultado(siguientes) });
  };

  const repetir = () => {
    setRespuestas([]);
    setCopiado(false);
    alTeñir(null);
  };

  const compartir = async () => {
    const url = `${window.location.origin}${window.location.pathname}?casa=${id}`;
    const texto = `El sombrero de El Caldero Mágico me ha mandado a ${casa.nombre}. ¿Y a ti?`;
    medir('test_compartido', { casa: id });

    if (navigator.share) {
      try {
        await navigator.share({ title: '¿Cuál es tu casa?', text: texto, url });
      } catch {
        // si cancela el diálogo, se queda como estaba
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${texto} ${url}`);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  if (casa) {
    return (
      <div className="test" style={{ '--acento': casa.color }}>
        <span className="antetitulo">El sombrero ha hablado</span>
        <h2 key={id}>
          <Letras texto={`¡${casa.nombre}!`} retardo={0.5} paso={0.05} />
        </h2>
        <p className="test-lema">{casa.lema}</p>
        <p className="entrada">{casa.perfil}</p>

        <div className="grupo">
          <h3>Las pociones de tu casa</h3>
          {casa.pociones.map((p) => (
            <div className="plato" key={p}>
              <div className="plato-linea">
                <span className="pociones-gota" style={{ '--tinte': POCION[p].color }} aria-hidden="true" />
                <span className="plato-nombre">{POCION[p].nombre}</span>
              </div>
              <p>{POCION[p].nota}</p>
            </div>
          ))}
          <p className="nota">
            En el local te lo confirma el Seleccionador de verdad, con sombrero incluido: es
            el primer cóctel de la clase de pociones.
          </p>
        </div>

        <div className="test-acciones">
          <button className="boton boton-lleno" type="button" onClick={() => alReservar(casa.pociones)}>
            Preparar las pociones de mi casa
          </button>
          <button className="boton" type="button" onClick={compartir}>
            {copiado ? 'Enlace copiado' : 'Compartir mi casa'}
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
        El Seleccionador · {paso + 1} de {PREGUNTAS.length}
      </span>

      {paso === 0 && reto && CASAS[reto] && (
        <p className="test-reto">
          A quien te lo ha mandado le tocó <strong>{CASAS[reto].nombre}</strong>. A ver a ti.
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
            style={{ '--retardo': `${0.35 + i * 0.07}s`, '--tinte': CASAS[respuesta.casa].color }}
            onClick={() => responder(respuesta)}
          >
            {respuesta.texto}
          </button>
        ))}
      </div>

      <p className="nota">Cinco preguntas. El caldero cambia con cada respuesta.</p>
    </div>
  );
}
