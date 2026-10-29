'use client';

import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import CauldronMesh from './CauldronMesh';
import Liquid from './Liquid';
import Steam from './Steam';

export default function Scene({ potion, glow, motion = 1, quality = 'alta' }) {
  const { camera } = useThree();
  const group = useRef(null);
  const potionLight = useRef(null);
  const rimLight = useRef(null);

  const targetGlow = useMemo(() => new THREE.Color(glow), [glow]);
  const pointer = useRef({ position: new THREE.Vector2(0, 0), strength: 0, previous: new THREE.Vector2() });

  // la cámara mira al interior del caldero, no al centro de la escena
  camera.lookAt(0, 0.42, 0);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;

    // el puntero, llevado al plano del líquido
    const target = pointer.current.position;
    const nextX = x * 1.1;
    const nextY = -y * 1.1;
    const travelled = Math.hypot(nextX - pointer.current.previous.x, nextY - pointer.current.previous.y);
    pointer.current.previous.set(nextX, nextY);
    target.set(nextX, nextY);

    // al mover el ratón la poción se agita; parada, se calma
    pointer.current.strength = THREE.MathUtils.lerp(
      pointer.current.strength,
      Math.min(1, travelled * 22),
      Math.min(1, delta * 4),
    );

    if (group.current && motion > 0) {
      // el caldero acompaña al puntero sin llegar a girar
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.22, Math.min(1, delta * 2));
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.08, Math.min(1, delta * 2));
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02 - 0.35;
    }

    if (potionLight.current) {
      potionLight.current.color.lerp(targetGlow, Math.min(1, delta * 2.2));
      // el hervor hace parpadear la luz que sale del caldero
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 3.1) * 0.08 + Math.sin(state.clock.elapsedTime * 7.7) * 0.04;
      potionLight.current.intensity = 13 * flicker * (motion > 0 ? 1 : 0.9);
    }
    if (rimLight.current) {
      rimLight.current.color.lerp(targetGlow, Math.min(1, delta * 2.2));
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#9db3cf" />

      {/* luz principal alta por la izquierda, como en las referencias */}
      <directionalLight position={[-4, 5.5, 3]} intensity={3.4} color="#ffe6c4" />

      {/* contraluz cálido que separa el caldero del fondo */}
      <pointLight ref={rimLight} position={[3.2, 1.8, -3]} intensity={14} distance={14} />

      {/* la poción iluminando el labio y las asas desde dentro */}
      <pointLight ref={potionLight} position={[0, 0.95, 0]} intensity={13} distance={6.5} decay={2} />

      <group ref={group} position={[0, -0.35, 0]}>
        <Suspense fallback={null}>
          <CauldronMesh />
        </Suspense>
        <Liquid color={potion} glow={glow} motion={motion} pointer={pointer} />
        {quality !== 'baja' && (
          <Steam glow={glow} motion={motion} count={quality === 'media' ? 450 : 1100} />
        )}
      </group>
    </>
  );
}
