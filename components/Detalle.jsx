'use client';

import Reserva from '@/components/Reserva';
import { BARRA, CARTA } from '@/lib/carta';
import { CHOCOLATEADAS, CLASE, EVENTOS, TRIVIAL } from '@/lib/experiencias';
import { LOCAL } from '@/lib/local';

function Datos({ pares }) {
  return (
    <dl className="datos">
      {pares.map(([clave, valor]) => (
        <div key={clave}>
          <dt>{clave}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Platos({ lista }) {
  return lista.map((plato) => (
    <div key={plato.nombre} className="plato">
      <div className="plato-linea">
        <span className="plato-nombre">{plato.nombre}</span>
        {plato.precio && <span className="plato-precio">{plato.precio} €</span>}
      </div>
      <p>{plato.desc}</p>
    </div>
  ));
}

// El contenido propio de cada opción. `alReservar` abre el formulario con el
// tipo ya elegido; `alTest` arranca "¿Qué poción eres?".
export default function Detalle({ id, reserva, alReservar, alTest }) {
  if (id === 'reservas') {
    return (
      <div className="detalle">
        <Reserva key={`${reserva.tipo}-${reserva.nota}`} tipoInicial={reserva.tipo} nota={reserva.nota} />
      </div>
    );
  }

  if (id === 'carta') {
    return (
      <div className="detalle">
        <p className="sello">Con opciones sin gluten y veganas</p>
        {CARTA.map((grupo) => (
          <div key={grupo.grupo} className="grupo">
            <h3>{grupo.grupo}</h3>
            <Platos lista={grupo.platos} />
          </div>
        ))}
      </div>
    );
  }

  if (id === 'cerveza') {
    return (
      <div className="detalle">
        <div className="grupo">
          <h3>Pociones y brebajes</h3>
          <Platos lista={BARRA} />
        </div>
        <p className="nota">
          Para la barra no hace falta reservar, pero viernes y sábado es buena idea.
        </p>
      </div>
    );
  }

  if (id === 'pociones') {
    return (
      <div className="detalle">
        <div className="precios">
          <div>
            <strong>{CLASE.adultos} €</strong>
            <span>adultos, por persona</span>
          </div>
          <div>
            <strong>{CLASE.menores} €</strong>
            <span>menores, sin alcohol</span>
          </div>
        </div>

        <Datos pares={CLASE.datos} />

        <div className="grupo">
          <h3>Elige dos pociones</h3>
          <Platos lista={CLASE.pociones} />
          <p className="nota">
            La primera siempre es la seleccionadora: el sombrero decide antes de empezar.
            El local es accesible en silla de ruedas; avísanos al reservar.
          </p>
          <button className="boton boton-fantasma" type="button" onClick={alTest}>
            ¿No sabes cuál? Haz el test
          </button>
        </div>

        <div className="grupo">
          <h3>Pociones chocolateadas</h3>
          <div className="precios">
            <div>
              <strong>{CHOCOLATEADAS.precio} €</strong>
              <span>por persona, adultos y peques</span>
            </div>
          </div>
          <p className="nota">{CHOCOLATEADAS.desc}</p>
          <Datos pares={CHOCOLATEADAS.datos} />
          <button className="boton boton-fantasma" type="button" onClick={() => alReservar('chocolate')}>
            Reservar chocolateadas
          </button>
        </div>
      </div>
    );
  }

  if (id === 'eventos') {
    return (
      <div className="detalle">
        <div className="grupo regalo">
          <h3>Tarjeta regalo</h3>
          <p className="direccion">Regala una tarde de magia</p>
          <p className="nota">
            Una clase de pociones, unas chocolateadas o una cena. Tú eliges el regalo y
            nosotros te preparamos la tarjeta.
          </p>
          <button className="boton boton-lleno" type="button" onClick={() => alReservar('regalo')}>
            Pedir una tarjeta regalo
          </button>
        </div>

        <div className="grupo">
          <h3>Celebra aquí</h3>
          <Platos lista={EVENTOS} />
        </div>

        <div className="grupo">
          <h3>Miércoles de trivial</h3>
          <p className="nota">{TRIVIAL.dia}, a jugar con la cena.</p>
          <Datos pares={TRIVIAL.datos} />
        </div>
      </div>
    );
  }

  if (id === 'llegar') {
    return (
      <div className="detalle">
        <div className="grupo">
          <h3>La dirección</h3>
          <p className="direccion">
            {LOCAL.calle}
            <br />
            {LOCAL.ciudad}
          </p>
          <p className="nota">
            Estamos en el casco viejo, en calle estrecha y zona peatonal: lo más cómodo es
            venir andando o dejar el coche en un parking del centro.
          </p>
        </div>

        <div className="grupo">
          <h3>Horario</h3>
          <ul className="horario">
            {LOCAL.horario.map((tramo) => (
              <li key={tramo.dias} data-cerrado={Boolean(tramo.cerrado)}>
                <span>{tramo.dias}</span>
                <span>{tramo.horas}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grupo">
          <h3>¿Dudas?</h3>
          <p className="nota">
            Llámanos al <a href={LOCAL.telefonoEnlace}>{LOCAL.telefono}</a> o escribe a{' '}
            <a href={`mailto:${LOCAL.correo}`}>{LOCAL.correo}</a>.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
