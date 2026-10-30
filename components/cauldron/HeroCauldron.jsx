'use client';

import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function HeroCauldron(props) {
  const estrecha = typeof window !== 'undefined' && window.innerWidth < 900;

  return (
    <Canvas
      camera={{ position: estrecha ? [0, 2.8, 7.0] : [0, 2.15, 5.1], fov: 42 }}
      dpr={props.quality === 'baja' ? 1 : [1, 1.8]}
      gl={{ antialias: props.quality !== 'baja', alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
