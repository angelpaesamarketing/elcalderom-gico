'use client';

import { useState } from 'react';
import Copa from '@/components/Copa';
import { CLASE, MAX_POCIONES, POCION } from '@/lib/experiencias';

// Selector de las pociones de la clase. Arriba, una copa que se llena del
// color de la poción que estás mirando; debajo, las cinco para elegir dos.
// `alMirar` avisa a la página para que el caldero se tiña del mismo color.
export default function Pociones({ elegidas, alCambiar, alMirar }) {
  const [mirando, setMirando] = useState(elegidas[elegidas.length - 1] ?? null);
  const pocion = mirando ? POCION[mirando] : null;
  const completo = elegidas.length >= MAX_POCIONES;

  const mirar = (id) => {
    setMirando(id);
    alMirar?.(id);
  };

  const alternar = (id) => {
    mirar(id);
    if (elegidas.includes(id)) {
      alCambiar(elegidas.filter((x) => x !== id));
      return;
    }
    // con las dos ya elegidas, la nueva sustituye a la más antigua
    alCambiar([...elegidas, id].slice(-MAX_POCIONES));
  };

  return (
    <div className="pociones" style={{ '--acento': pocion?.color }}>
      <div className="pociones-copa" aria-live="polite">
        <Copa color={pocion?.color} brillo={pocion?.brillo} etiqueta={pocion?.nombre} />
        <div>
          <strong>{pocion ? pocion.nombre : 'Elige una poción'}</strong>
          <p>{pocion ? pocion.nota : 'Toca cualquiera para verla servida.'}</p>
          {pocion && <p className="pociones-receta">{pocion.desc}</p>}
        </div>
      </div>

      <p className="pociones-cuenta">
        {completo
          ? 'Ya tenéis las dos. Toca otra para cambiarla.'
          : `Elegid ${MAX_POCIONES} · lleváis ${elegidas.length}`}
      </p>

      <div className="pociones-lista">
        {CLASE.pociones.map((p) => {
          const marcada = elegidas.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={marcada}
              data-mirando={p.id === mirando}
              style={{ '--tinte': p.color }}
              onClick={() => alternar(p.id)}
              onPointerEnter={(evento) => evento.pointerType === 'mouse' && mirar(p.id)}
              onFocus={() => mirar(p.id)}
            >
              <span className="pociones-gota" aria-hidden="true" />
              <span>{p.nombre}</span>
              <span className="pociones-marca" aria-hidden="true">
                {marcada ? '✓' : '+'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
