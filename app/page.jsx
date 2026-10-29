'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { SECTIONS } from '@/lib/sections';

// el lienzo solo existe en el navegador: no hay WebGL en el servidor
const HeroCauldron = dynamic(() => import('@/components/cauldron/HeroCauldron'), {
  ssr: false,
});

// Pantallas flojas no mueven 220 partículas: se reparte en tres niveles.
function detectarCalidad() {
  if (typeof window === 'undefined') return 'alta';
  const nucleos = navigator.hardwareConcurrency || 4;
  const estrecha = window.matchMedia('(max-width: 899px)').matches;
  if (estrecha && nucleos <= 4) return 'baja';
  if (estrecha || nucleos <= 4) return 'media';
  return 'alta';
}

export default function Home() {
  const [activa, setActiva] = useState(0);
  const [calidad, setCalidad] = useState('alta');
  const [movimiento, setMovimiento] = useState(1);
  const referencias = useRef([]);

  useEffect(() => {
    setCalidad(detectarCalidad());

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => setMovimiento(consulta.matches ? 0 : 1);
    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => consulta.removeEventListener('change', aplicar);
  }, []);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const indice = Number(entrada.target.dataset.indice);
          setActiva(indice);
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
    <main style={{ '--acento': seccion.potion }}>
      <div className="escena" aria-hidden="true">
        <HeroCauldron
          potion={seccion.potion}
          glow={seccion.glow}
          motion={movimiento}
          quality={calidad}
        />
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

        <a className="boton" href="#reservar">
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
            <div className="bloque aparece">
              <span className="antetitulo">{item.eyebrow}</span>
              {indice === 0 ? <h1>{item.title}</h1> : <h2>{item.title}</h2>}
              <p>{item.body}</p>
              <a className="boton" href="#reservar">
                {item.cta}
              </a>
            </div>
          </section>
        ))}
      </div>

      <footer className="pie" id="reservar">
        <p>
          Zaragoza · <a href="tel:+34624226793">624 226 793</a> ·{' '}
          <a href="https://www.instagram.com/elcalderomagico.zaragoza/" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </p>
        <p className="pie-nota">
          El Caldero Mágico no está afiliado ni guarda relación con Warner Bros, Wizarding World ni
          con ninguna otra película o serie de fantasía.
        </p>
      </footer>
    </main>
  );
}
