'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Onda de choque: al elegir una opción sale un anillo del caldero que se
// expande y se apaga. Es lo que convierte el cambio en un golpe.
export default function Onda({ disparo, glow, motion = 1 }) {
  const malla = useRef(null);
  const avance = useRef(1);
  const color = useMemo(() => new THREE.Color(glow), [glow]);

  useEffect(() => {
    if (disparo) avance.current = 0;
  }, [disparo]);

  useFrame((state, delta) => {
    const m = malla.current;
    if (!m) return;

    if (avance.current < 1) {
      avance.current = Math.min(1, avance.current + delta * (motion > 0 ? 1.1 : 4));
    }

    const p = avance.current;
    const escala = 0.6 + p * 7.5;
    m.scale.set(escala, escala, escala);
    m.material.opacity = Math.pow(1 - p, 2.2) * 0.85;
    m.material.color.lerp(color, Math.min(1, delta * 4));
    m.visible = p < 1;
  });

  return (
    <mesh ref={malla} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.72, 0.84, 96]} />
      <meshBasicMaterial
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
