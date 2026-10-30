'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { OPCIONES, REPOSO } from '@/lib/sections';
import { BARRA, CARTA, CLASE } from '@/lib/carta';
import { LOCAL } from '@/lib/local';

// el lienzo solo existe en el navegador: no hay WebGL en el servidor
const HeroCauldron = dynamic(() => import('@/components/cauldron/HeroCauldron'), {
  ssr: false,
});

function detectarCalidad() {
  const nucleos = navigator.hardwareConcurrency || 4;
  const estrecha = window.matchMedia('(max-width: 899px)').matches;
  if (estrecha && nucleos <= 4) return 'baja';
  if (estrecha || nucleos <= 4) return 'media';
  return 'alta';
}

function hayWebGL() {
  try {
    const lienzo = document.createElement('canvas');
    return Boolean(lienzo.getContext('webgl2') || lienzo.getContext('webgl'));
  } catch {
    return false;
  }
}

// El contenido propio de cada opción: la carta, la barra y la clase salen
// del PDF del restaurante.
function Detalle({ id }) {
  if (id === 'carta') {
    return (
      <div className="detalle">
        {CARTA.map((grupo) => (
          <div key={grupo.grupo} className="grupo">
            <h3>{grupo.grupo}</h3>
            {grupo.platos.map((plato) => (
              <div key={plato.nombre} className="plato">
                <div className="plato-linea">
                  <span className="plato-nombre">{plato.nombre}</span>
                  <span className="plato-precio">{plato.precio} €</span>
                </div>
                <p>{plato.desc}</p>
              </div>
            ))}
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
          {BARRA.map((bebida) => (
            <div key={bebida.nombre} className="plato">
              <div className="plato-linea">
                <span className="plato-nombre">{bebida.nombre}</span>
                <span className="plato-precio">{bebida.precio} €</span>
              </div>
              <p>{bebida.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'pociones') {
    return (
      <div className="detalle">
        <div className="precios">
          <div>
            <strong>{CLASE.conAlcohol} €</strong>
            <span>con alcohol, por persona</span>
          </div>
          <div>
            <strong>{CLASE.sinAlcohol} €</strong>
            <span>sin alcohol, por persona</span>
          </div>
        </div>
        <div className="grupo">
          <h3>Elige dos pociones</h3>
          <ul className="lista">
            {CLASE.pociones.map((pocion) => (
              <li key={pocion}>{pocion}</li>
            ))}
          </ul>
          <p className="nota">
            La primera siempre es la seleccionadora: el sombrero decide tu casa antes de
            empezar. Túnica y varita incluidas.
          </p>
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
            Llámanos al <a href={LOCAL.telefonoEnlace}>{LOCAL.telefono}</a> y te decimos
            cómo llegar desde donde estés.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function Home() {
  const [seleccion, setSeleccion] = useState(null);
  const [menu, setMenu] = useState(false);
  const [calidad, setCalidad] = useState('alta');
  const [movimiento, setMovimiento] = useState(1);
  const [webgl, setWebgl] = useState(true);

  const giro = useRef({ angulo: 0, velocidad: 0, arrastre: 0, caldero: 0 });
  const arrastre = useRef({ activo: false, ultimoX: 0 });

  useEffect(() => {
    setCalidad(detectarCalidad());
    setWebgl(hayWebGL());

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => setMovimiento(consulta.matches ? 0 : 1);
    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => consulta.removeEventListener('change', aplicar);
  }, []);

  // Escape cierra lo que esté abierto: primero el menú, luego el detalle
  useEffect(() => {
    const alPulsar = (evento) => {
      if (evento.key !== 'Escape') return;
      setMenu((abierto) => {
        if (abierto) return false;
        setSeleccion(null);
        return false;
      });
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, []);

  const empezarArrastre = useCallback((evento) => {
    arrastre.current.activo = true;
    arrastre.current.ultimoX = evento.clientX;
    giro.current.arrastre = 0;
  }, []);

  const moverArrastre = useCallback((evento) => {
    if (!arrastre.current.activo) return;
    const delta = evento.clientX - arrastre.current.ultimoX;
    arrastre.current.ultimoX = evento.clientX;
    giro.current.angulo += delta * 0.005;
    giro.current.velocidad = delta * 0.09;
    giro.current.caldero += delta * 0.0022;
    giro.current.arrastre += Math.abs(delta);
  }, []);

  const soltarArrastre = useCallback(() => {
    arrastre.current.activo = false;
  }, []);

  const abrir = (id) => {
    setSeleccion(id);
    setMenu(false);
  };

  const activa = OPCIONES.find((o) => o.id === seleccion);
  const colores = activa ?? REPOSO;

  return (
    <main
      className="escenario"
      data-modo={seleccion ? 'detalle' : 'orbita'}
      data-webgl={webgl ? 'si' : 'no'}
      style={{ '--acento': colores.potion }}
    >
      {/* la sala de pociones, de fondo: muy oscura y desenfocada */}
      <div className="sala" aria-hidden="true" />

      <div
        className="escena"
        onPointerDown={empezarArrastre}
        onPointerMove={moverArrastre}
        onPointerUp={soltarArrastre}
        onPointerLeave={soltarArrastre}
      >
        {webgl ? (
          <HeroCauldron
            potion={colores.potion}
            glow={colores.glow}
            motion={movimiento}
            quality={calidad}
            opciones={OPCIONES}
            seleccion={seleccion}
            onSelect={setSeleccion}
            giro={giro}
          />
        ) : (
          <img className="escena-respaldo" src="/caldero/caldero-respaldo.webp" alt="" />
        )}
      </div>
      <div className="escena-velo" aria-hidden="true" />

      <header className="cabecera">
        <button className="marca" type="button" onClick={() => { setSeleccion(null); setMenu(false); }}>
          <img src="/marca/logo.png" alt="El Caldero Mágico" />
        </button>

        <div className="cabecera-derecha">
          <a className="boton solo-ancho-flex" href={LOCAL.telefonoEnlace}>
            {LOCAL.telefono}
          </a>

          {/* Por si la órbita no se entiende a la primera: el mismo menú,
              donde todo el mundo lo busca. */}
          <button
            className="hamburguesa"
            type="button"
            aria-expanded={menu}
            aria-controls="menu-principal"
            onClick={() => setMenu((abierto) => !abierto)}
          >
            <span className="hamburguesa-lineas" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="oculto">{menu ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </header>

      <div
        id="menu-principal"
        className="cortina"
        data-abierto={menu}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) setMenu(false);
        }}
      >
        <nav className="cortina-lista">
          {OPCIONES.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              onClick={() => abrir(opcion.id)}
              style={{ '--tinte': opcion.potion }}
            >
              <img src={`/recortables/${opcion.icon}.webp`} alt="" aria-hidden="true" />
              <span>{opcion.nav}</span>
            </button>
          ))}
        </nav>

        <div className="cortina-pie">
          <a href={LOCAL.telefonoEnlace}>{LOCAL.telefono}</a>
          <a href={LOCAL.mapa} target="_blank" rel="noreferrer">
            {LOCAL.calle}
          </a>
          <a
            href="https://www.instagram.com/elcalderomagico.zaragoza/"
            target="_blank"
            rel="noreferrer"
          >
            @elcalderomagico.zaragoza
          </a>
        </div>
      </div>

      {/* Órbita: el caldero es el menú */}
      <section className="portada" aria-hidden={Boolean(seleccion)}>
        <h1>
          El Caldero
          <br />
          Mágico
        </h1>
        <p>
          Restaurante mágico en Zaragoza.{' '}
          {/* en vertical no hay órbita que girar: el menú son las tarjetas */}
          <span className="solo-ancho">Gira el caldero y elige por dónde empezar.</span>
          <span className="solo-estrecho">Elige por dónde quieres empezar.</span>
        </p>

        {/* El mismo menú sirve en las dos pantallas y hace de alternativa
            accesible: en ancho son enlaces de texto junto a la órbita, en
            vertical son tarjetas grandes con el objeto de cada opción, que
            es donde la órbita no se puede tocar. */}
        <nav className="menu-opciones">
          {OPCIONES.map((opcion, indice) => (
            <button
              key={opcion.id}
              type="button"
              onClick={() => abrir(opcion.id)}
              style={{ '--retardo': `${indice * 45}ms`, '--tinte': opcion.potion }}
            >
              <img src={`/recortables/${opcion.icon}.webp`} alt="" aria-hidden="true" />
              <span>{opcion.nav}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* Detalle de la opción elegida */}
      <section className="panel" aria-hidden={!seleccion}>
        {activa && (
          <div className="panel-caja">
            <button className="volver" type="button" onClick={() => setSeleccion(null)}>
              ← Volver al caldero
            </button>

            <span className="antetitulo">{activa.eyebrow}</span>
            <h2>{activa.title}</h2>
            <p className="entrada">{activa.body}</p>

            <Detalle id={activa.id} />

            {activa.id === 'llegar' ? (
              <a className="boton" href={LOCAL.mapa} target="_blank" rel="noreferrer">
                {activa.cta}
              </a>
            ) : (
              <a className="boton" href={activa.href ?? LOCAL.telefonoEnlace}>
                {activa.cta}
              </a>
            )}
          </div>
        )}
      </section>

      <footer className="pie">
        <a href={LOCAL.mapa} target="_blank" rel="noreferrer">
          {LOCAL.calle}
        </a>
        <a href="https://www.instagram.com/elcalderomagico.zaragoza/" target="_blank" rel="noreferrer">
          @elcalderomagico.zaragoza
        </a>
        <span className="pie-nota">
          Sin relación con Warner Bros, Wizarding World ni ninguna otra película o serie.
        </span>
      </footer>
    </main>
  );
}
