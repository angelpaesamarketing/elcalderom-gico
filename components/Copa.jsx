'use client';

import { useId } from 'react';

// Copa de cóctel dibujada en SVG. El licor toma el color de la poción y
// cambia con una transición, así que al pasar de una a otra se ve cómo se
// tiñe. Vacía (sin color) enseña solo el cristal.
export default function Copa({ color, brillo, etiqueta }) {
  const id = useId().replace(/:/g, '');
  const llena = Boolean(color);

  return (
    <svg
      className="copa"
      viewBox="0 0 140 190"
      role="img"
      aria-label={etiqueta ?? 'Copa vacía'}
      data-llena={llena}
      style={{ '--licor': color ?? 'transparent', '--destello': brillo ?? 'transparent' }}
    >
      <defs>
        {/* el interior del cáliz: todo lo líquido se recorta contra él */}
        <clipPath id={`caliz-${id}`}>
          <path d="M22 28 Q26 92 70 100 Q114 92 118 28 Z" />
        </clipPath>
        <linearGradient id={`fondo-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <ellipse className="copa-halo" cx="70" cy="66" rx="62" ry="50" />

      <g clipPath={`url(#caliz-${id})`}>
        <g className="copa-licor">
          <rect x="10" y="44" width="120" height="70" />
          {/* la superficie: una onda que se desplaza de lado */}
          <path className="copa-onda" d="M-30 44 Q-15 38 0 44 T30 44 T60 44 T90 44 T120 44 T150 44 T180 44 V56 H-30 Z" />
          <rect x="10" y="44" width="120" height="70" fill={`url(#fondo-${id})`} />
          <circle className="copa-burbuja" cx="52" cy="92" r="2.2" />
          <circle className="copa-burbuja" cx="74" cy="96" r="1.6" style={{ animationDelay: '0.9s' }} />
          <circle className="copa-burbuja" cx="88" cy="88" r="2" style={{ animationDelay: '1.7s' }} />
          <circle className="copa-burbuja" cx="64" cy="90" r="1.3" style={{ animationDelay: '2.4s' }} />
        </g>
      </g>

      {/* el cristal, por encima del licor */}
      <path className="copa-cristal" d="M20 26 Q24 94 70 102 Q116 94 120 26" />
      <ellipse className="copa-cristal" cx="70" cy="26" rx="50" ry="7" />
      <path className="copa-cristal" d="M70 102 V160" />
      <path className="copa-cristal" d="M40 168 Q70 156 100 168 Q70 176 40 168 Z" />
      <path className="copa-reflejo" d="M32 38 Q34 70 50 86" />
    </svg>
  );
}
