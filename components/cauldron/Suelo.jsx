'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Un halo tenue bajo el caldero. Sin él la pieza flota en la nada; con él
// parece apoyada sobre algo y la poción tiñe el suelo.
export default function Suelo({ glow, motion = 1 }) {
  const material = useRef(null);
  const destino = useMemo(() => new THREE.Color(glow), [glow]);

  const textura = useMemo(() => {
    const lado = 256;
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = lado;
    const ctx = lienzo.getContext('2d');
    const grad = ctx.createRadialGradient(lado / 2, lado / 2, 0, lado / 2, lado / 2, lado / 2);
    grad.addColorStop(0, 'rgba(255,255,255,0.5)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.14)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, lado, lado);
    const t = new THREE.CanvasTexture(lienzo);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame((state, delta) => {
    if (!material.current) return;
    material.current.color.lerp(destino, Math.min(1, delta * 2));
    // respira con el hervor
    const latido = 0.5 + Math.sin(state.clock.elapsedTime * 1.1) * 0.06 * motion;
    material.current.opacity = latido;
  });

  return (
    <mesh position={[0, -0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial
        ref={material}
        map={textura}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
