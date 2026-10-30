'use client';

import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function HeroCauldron(props) {
  const estrecha = typeof window !== 'undefined' && window.innerWidth < 900;

  return (
    <Canvas
      camera={{ position: estrecha ? [0, 2.25, 7.4] : [0, 2.15, 5.1], fov: 42 }}
      // en móvil la densidad real es 3: a 1,8 el caldero se veía escalonado
      dpr={props.quality === 'baja' ? [1, 1.75] : [1, 2.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
