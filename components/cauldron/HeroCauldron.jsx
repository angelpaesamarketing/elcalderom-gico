'use client';

import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function HeroCauldron({ potion, glow, motion, quality }) {
  return (
    <Canvas
      camera={{ position: [0, 2.15, 4.15], fov: 40 }}
      dpr={quality === 'baja' ? 1 : [1, 1.8]}
      gl={{ antialias: quality !== 'baja', alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene potion={potion} glow={glow} motion={motion} quality={quality} />
    </Canvas>
  );
}
