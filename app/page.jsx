'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import Detalle from '@/components/Detalle';
import Letras from '@/components/Letras';
import Test from '@/components/Test';
import { apagar, encender } from '@/lib/sonido';
import { OPCIONES, REPOSO } from '@/lib/sections';
import { LOCAL } from '@/lib/local';
import { medir } from '@/lib/medir';
import { POCIONES } from '@/lib/test';

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

// El caldero antes de la primera respuesta del test: ni una poción ni otra.
const NIEBLA = { potion: '#8ea2e8', glow: '#dfe6ff' };

export default function Home() {
  const [seleccion, setSeleccion] = useState(null);
  const [menu, setMenu] = useState(false);
  const [pista, setPista] = useState(true);
  const [estrecha, setEstrecha] = useState(false);
  const [entrando, setEntrando] = useState(true);
  const [sonando, setSonando] = useState(false);
  // con qué llega relleno el formulario de reserva
  const [reserva, setReserva] = useState({ tipo: 'mesa', nota: '' });
  // el test tiñe el caldero y lanza una onda con cada respuesta
  const [tinte, setTinte] = useState(null);
  const [pulso, setPulso] = useState(0);
  // poción de quien te mandó el enlace, si vienes de uno compartido
  const [reto, setReto] = useState(null);
  const panel = useRef(null);
  const [escenaLista, setEscenaLista] = useState(false);
  const [calidad, setCalidad] = useState('alta');
  const [movimiento, setMovimiento] = useState(1);
  const [webgl, setWebgl] = useState(true);

  const giro = useRef({ angulo: 0, velocidad: 0, arrastre: 0, caldero: 0 });
  const arrastre = useRef({ activo: false, ultimoX: 0 });

  useEffect(() => {
    setCalidad(detectarCalidad());
    setWebgl(hayWebGL());

    const vertical = window.matchMedia('(max-width: 899px)');
    const medir = () => setEstrecha(vertical.matches);
    medir();
    vertical.addEventListener('change', medir);

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => setMovimiento(consulta.matches ? 0 : 1);
    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => {
      vertical.removeEventListener('change', medir);
      consulta.removeEventListener('change', aplicar);
    };
  }, []);

  // La entrada: la cámara cae sobre el caldero mientras el telón se abre.
  // El telón espera al primer fotograma de la escena, porque si no se abre
  // sobre un lienzo vacío y la caída se la pierde nadie.
  useEffect(() => {
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido) {
      setEntrando(false);
      return undefined;
    }
    // red de seguridad por si la escena nunca llega a cargar
    const tope = setTimeout(() => setEntrando(false), 6000);
    return () => clearTimeout(tope);
  }, []);

  useEffect(() => {
    if (!escenaLista) return undefined;
    const reloj = setTimeout(() => setEntrando(false), 1500);
    return () => clearTimeout(reloj);
  }, [escenaLista]);

  // Un enlace compartido (?pocion=amor) abre el test nada más entrar, con
  // el resultado de quien lo mandó como reto.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('pocion');
    if (id && POCIONES[id]) setReto(id);
  }, []);

  useEffect(() => {
    if (!reto || entrando) return undefined;
    const reloj = setTimeout(() => {
      setSeleccion((actual) => actual ?? 'test');
      medir('test_abierto', { origen: 'enlace' });
    }, 900);
    return () => clearTimeout(reloj);
  }, [reto, entrando]);

  // cada sección empieza arriba, aunque la anterior se quedara a medias
  useEffect(() => {
    if (panel.current) panel.current.scrollTop = 0;
  }, [seleccion, reserva]);

  // Escape cierra lo que esté abierto: primero el menú, luego el detalle
  useEffect(() => {
    const alPulsar = (evento) => {
      if (evento.key !== 'Escape') return;
      setMenu((abierto) => {
        if (abierto) return false;
        setSeleccion(null);
        setTinte(null);
        return false;
      });
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, []);

  const empezarArrastre = useCallback((evento) => {
    arrastre.current.activo = true;
    arrastre.current.ultimoX = evento.clientX;
    arrastre.current.ultimoY = evento.clientY;
    giro.current.arrastre = 0;
  }, []);

  const moverArrastre = useCallback(
    (evento) => {
      if (!arrastre.current.activo) return;

      const dx = evento.clientX - arrastre.current.ultimoX;
      const dy = evento.clientY - arrastre.current.ultimoY;
      arrastre.current.ultimoX = evento.clientX;
      arrastre.current.ultimoY = evento.clientY;

      // la noria se mueve arriba y abajo; el carrusel ancho, a los lados
      const delta = estrecha ? -dy : dx;

      giro.current.angulo += delta * 0.005;
      giro.current.velocidad = delta * 0.09;
      giro.current.caldero += (estrecha ? dx : delta) * 0.0022;
      giro.current.arrastre += Math.abs(dx) + Math.abs(dy);

      // en cuanto arrastra, la pista sobra
      if (giro.current.arrastre > 24) setPista(false);
    },
    [estrecha],
  );

  const soltarArrastre = useCallback(() => {
    arrastre.current.activo = false;
  }, []);

  const alternarSonido = async () => {
    if (sonando) {
      await apagar();
      setSonando(false);
      return;
    }
    const listo = await encender();
    setSonando(listo);
  };

  const abrir = (id, origen = 'menu') => {
    setSeleccion(id);
    setTinte(null);
    setMenu(false);
    medir('seccion_abierta', { seccion: id, origen });
  };

  // Todo botón de reservar acaba aquí: abre el formulario ya relleno con lo
  // que el usuario estaba mirando.
  const reservar = (tipo = 'mesa', nota = '', origen = 'boton') => {
    setReserva({ tipo, nota });
    setSeleccion('reservas');
    setTinte(null);
    setMenu(false);
    medir('reserva_abierta', { tipo, origen });
  };

  const empezarTest = (origen) => {
    setSeleccion('test');
    setTinte(null);
    setMenu(false);
    medir('test_abierto', { origen });
  };

  const teñir = (id) => {
    setTinte(id);
    if (id) setPulso((n) => n + 1);
  };

  const volver = () => {
    setSeleccion(null);
    setTinte(null);
  };

  const enTest = seleccion === 'test';
  const activa = OPCIONES.find((o) => o.id === seleccion);
  const colores = enTest
    ? tinte
      ? { potion: POCIONES[tinte].color, glow: POCIONES[tinte].brillo }
      : NIEBLA
    : (activa ?? REPOSO);

  return (
    <main
      className="escenario"
      data-modo={seleccion ? 'detalle' : 'orbita'}
      data-webgl={webgl ? 'si' : 'no'}
      data-entrando={entrando}
      style={{ '--acento': colores.potion }}
    >
      {/* telón de entrada: negro con el logo, que se abre al caer la cámara */}
      <div className="telon" data-fin={!entrando} aria-hidden="true">
        <img src="/marca/logo.png" alt="" />
      </div>

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
            volar={escenaLista}
            onListo={() => setEscenaLista(true)}
            opciones={OPCIONES}
            seleccion={seleccion}
            disparo={`${seleccion ?? ''}|${pulso}`}
            onSelect={(id) => (id === 'reservas' ? reservar('mesa', '', 'orbita') : abrir(id, 'orbita'))}
            giro={giro}
          />
        ) : (
          <img className="escena-respaldo" src="/caldero/caldero-respaldo.webp" alt="" />
        )}
      </div>
      <div className="escena-velo" aria-hidden="true" />

      <header className="cabecera">
        <button className="marca" type="button" onClick={() => { volver(); setMenu(false); }}>
          <img src="/marca/logo.png" alt="El Caldero Mágico" />
        </button>

        <div className="cabecera-derecha">
          <button
            className="sonido"
            type="button"
            aria-pressed={sonando}
            onClick={alternarSonido}
          >
            <span className="sonido-barras" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="oculto">{sonando ? 'Silenciar' : 'Activar sonido'}</span>
          </button>

          {/* el botón que más importa, siempre a la vista */}
          <button
            className="boton boton-lleno solo-ancho-flex"
            type="button"
            onClick={() => reservar('mesa', '', 'cabecera')}
          >
            Reservar
          </button>

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
              onClick={() => (opcion.destacado ? reservar('mesa', '', 'menu') : abrir(opcion.id))}
              data-destacado={Boolean(opcion.destacado)}
              style={{ '--tinte': opcion.potion }}
            >
              <img src={`/recortables/${opcion.icon}.webp`} alt="" aria-hidden="true" />
              <span>{opcion.destacado ? 'Reservar mesa' : opcion.nav}</span>
              {opcion.destacado && <span className="cortina-pista">En veinte segundos</span>}
            </button>
          ))}
          <button type="button" className="cortina-test" onClick={() => empezarTest('menu')}>
            <span className="chispa" aria-hidden="true">✦</span>
            <span>¿Qué poción eres?</span>
            <span className="cortina-pista">Haz el test</span>
          </button>
        </nav>

        <div className="cortina-pie">
          <a href={LOCAL.telefonoEnlace}>{LOCAL.telefono}</a>
          <a href={LOCAL.mapa} target="_blank" rel="noreferrer">
            {LOCAL.calle}
          </a>
          <a href={LOCAL.instagram} target="_blank" rel="noreferrer">
            {LOCAL.instagramNombre}
          </a>
        </div>
      </div>

      {/* Órbita: el caldero es el menú */}
      <section className="portada" aria-hidden={Boolean(seleccion)}>
        <h1>
          <Letras texto="El Caldero" retardo={2.5} />
          <br />
          <Letras texto="Mágico" retardo={2.78} />
        </h1>
        <p>
          Restaurante mágico en Zaragoza.{' '}
          {/* en vertical no hay órbita que girar: el menú son las tarjetas */}
          <span className="solo-ancho">Gira el caldero y elige por dónde empezar.</span>
          <span className="solo-estrecho">Elige por dónde quieres empezar.</span>
        </p>

        <button className="boton boton-test" type="button" onClick={() => empezarTest('portada')}>
          <span className="chispa" aria-hidden="true">✦</span>
          ¿Qué poción eres?
        </button>

        {/* El mismo menú sirve en las dos pantallas y hace de alternativa
            accesible: en ancho son enlaces de texto junto a la órbita, en
            vertical son tarjetas grandes con el objeto de cada opción, que
            es donde la órbita no se puede tocar. */}
        <nav className="menu-opciones">
          {OPCIONES.map((opcion, indice) => (
            <button
              key={opcion.id}
              type="button"
              onClick={() => (opcion.destacado ? reservar('mesa', '', 'portada') : abrir(opcion.id, 'portada'))}
              style={{ '--retardo': `${indice * 45}ms`, '--tinte': opcion.potion }}
            >
              <img src={`/recortables/${opcion.icon}.webp`} alt="" aria-hidden="true" />
              <span>{opcion.nav}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* Detalle de la opción elegida, o el test */}
      <section className="panel" ref={panel} aria-hidden={!seleccion} data-test={enTest}>
        {enTest && (
          <div className="panel-caja">
            <button className="volver" type="button" onClick={volver}>
              ← Volver al caldero
            </button>
            <Test
              alTeñir={teñir}
              alReservar={(nombre) => reservar('clase', `Quiero preparar la ${nombre}.`, 'test')}
              reto={reto}
            />
          </div>
        )}

        {activa && (
          <div className="panel-caja">
            <button className="volver" type="button" onClick={volver}>
              ← Volver al caldero
            </button>

            <span className="antetitulo">{activa.eyebrow}</span>
            <h2 key={activa.id}>
              <Letras texto={activa.title} retardo={0.16} paso={0.022} />
            </h2>
            <p className="entrada">{activa.body}</p>

            <Detalle
              id={activa.id}
              reserva={reserva}
              alReservar={(tipo) => reservar(tipo, '', activa.id)}
              alTest={() => empezarTest('clase')}
            />

            {activa.id === 'llegar' && (
              <a className="boton boton-lleno" href={LOCAL.mapa} target="_blank" rel="noreferrer">
                {activa.cta}
              </a>
            )}
            {activa.reserva && (
              <button
                className="boton boton-lleno"
                type="button"
                onClick={() => reservar(activa.reserva, '', activa.id)}
              >
                {activa.cta}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Pista de que la órbita se puede mover. Se va para siempre en cuanto
          el usuario arrastra una vez. */}
      <span
        className="pista-deslizar"
        aria-hidden="true"
        data-visible={pista && !seleccion && !menu}
      >
        Desliza
      </span>

      {/* En vertical no hay sitio para un botón en la cabecera: va fijo
          abajo, al alcance del pulgar, y se aparta cuando hay algo abierto. */}
      <div className="fijo">
        <button className="fijo-test" type="button" onClick={() => empezarTest('movil')}>
          <span className="chispa" aria-hidden="true">✦</span>
          ¿Qué poción eres?
        </button>
        <button className="reservar-fijo" type="button" onClick={() => reservar('mesa', '', 'barra')}>
          Reservar mesa
        </button>
      </div>

      <footer className="pie">
        <a href={LOCAL.mapa} target="_blank" rel="noreferrer">
          {LOCAL.calle}
        </a>
        <a href={LOCAL.instagram} target="_blank" rel="noreferrer">
          {LOCAL.instagramNombre}
        </a>
        <span className="pie-nota">
          Sin relación con Warner Bros, Wizarding World ni ninguna otra película o serie.
        </span>
      </footer>
    </main>
  );
}
