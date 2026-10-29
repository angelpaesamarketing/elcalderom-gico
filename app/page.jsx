'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Props from '@/components/Props';
import { SECTIONS } from '@/lib/sections';

// el lienzo solo existe en el navegador: no hay WebGL en el servidor
const HeroCauldron = dynamic(() => import('@/components/cauldron/HeroCauldron'), {
  ssr: false,
});

// Pantallas flojas no mueven 700 partículas: se reparte en tres niveles.
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

export default function Home() {
  const [activa, setActiva] = useState(0);
  const [calidad, setCalidad] = useState('alta');
  const [movimiento, setMovimiento] = useState(1);
  const [webgl, setWebgl] = useState(true);
  const principal = useRef(null);
  const referencias = useRef([]);

  useEffect(() => {
    setCalidad(detectarCalidad());
    setWebgl(hayWebGL());

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => setMovimiento(consulta.matches ? 0 : 1);
    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => consulta.removeEventListener('change', aplicar);
  }, []);

  // El scroll alimenta una variable CSS y son los objetos los que se mueven,
  // así no hay un re-render de React por cada píxel.
  useEffect(() => {
    let pendiente = false;
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        principal.current?.style.setProperty('--desplazamiento', String(window.scrollY));
        pendiente = false;
      });
    };
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          setActiva(Number(entrada.target.dataset.indice));
          entrada.target.querySelector('.aparece')?.setAttribute('data-visible', 'true');
        });
      },
      { threshold: 0.45 },
    );

    referencias.current.forEach((nodo) => nodo && observador.observe(nodo));
    return () => observador.disconnect();
  }, []);

  const seccion = SECTIONS[activa];

  return (
    <main ref={principal} style={{ '--acento': seccion.potion }}>
      {/* fondos de ambiente: se cruzan por opacidad al cambiar de sección */}
      <div className="fondos" aria-hidden="true">
        {SECTIONS.filter((item) => item.backdrop).map((item) => (
          <div
            key={item.backdrop}
            className="fondo"
            data-visible={seccion.backdrop === item.backdrop}
            style={{ backgroundImage: `url(/ambiente/ambiente-${item.backdrop}.webp)` }}
          />
        ))}
      </div>

      <div className="escena" aria-hidden="true">
        {webgl ? (
          <HeroCauldron
            potion={seccion.potion}
            glow={seccion.glow}
            motion={movimiento}
            quality={calidad}
          />
        ) : (
          // sin WebGL la web sigue siendo la web: se cae a una imagen
          <img className="escena-respaldo" src="/caldero/caldero-respaldo.webp" alt="" />
        )}
      </div>
      <div className="escena-velo" aria-hidden="true" />

      <header className="cabecera">
        <a className="marca" href="#inicio">
          <img src="/marca/logo.png" alt="" />
          <span>El Caldero Mágico</span>
        </a>

        <nav className="menu">
          {SECTIONS.map((item, indice) => (
            <a key={item.id} href={`#${item.id}`} data-activo={indice === activa}>
              {item.nav}
            </a>
          ))}
        </nav>

        <a className="boton" href="#contacto">
          Reserva ya
        </a>
      </header>

      <div className="contenido">
        {SECTIONS.map((item, indice) => (
          <section
            key={item.id}
            id={item.id}
            className="seccion"
            data-indice={indice}
            ref={(nodo) => {
              referencias.current[indice] = nodo;
            }}
          >
            <Props items={item.props} visible={indice === activa} />

            <div className="bloque aparece">
              <span className="antetitulo">{item.eyebrow}</span>
              {indice === 0 ? <h1>{item.title}</h1> : <h2>{item.title}</h2>}
              <p>{item.body}</p>
              <a className="boton" href="#contacto">
                {item.cta}
              </a>
            </div>

            {indice === 0 && (
              <span className="pista" aria-hidden="true">
                <span className="pista-linea" />
                Desliza
              </span>
            )}
          </section>
        ))}
      </div>

      <footer className="pie" id="contacto">
        <div className="pie-rejilla">
          <div>
            <h3>Ven a vernos</h3>
            <p>
              Zaragoza
              <br />
              <a href="tel:+34624226793">624 226 793</a>
            </p>
          </div>
          <div>
            <h3>Síguenos</h3>
            <p>
              <a
                href="https://www.instagram.com/elcalderomagico.zaragoza/"
                target="_blank"
                rel="noreferrer"
              >
                @elcalderomagico.zaragoza
              </a>
            </p>
          </div>
          <div>
            <h3>Reservas</h3>
            <p>
              Mesa, clase de pociones o las dos cosas. También tarjetas regalo y
              cumpleaños.
            </p>
            <a className="boton boton-fantasma" href="tel:+34624226793">
              Llamar
            </a>
          </div>
        </div>

        <p className="pie-nota">
          El Caldero Mágico no está afiliado ni guarda relación con Warner Bros, Wizarding
          World ni con ninguna otra película o serie de fantasía.
        </p>
      </footer>
    </main>
  );
}
