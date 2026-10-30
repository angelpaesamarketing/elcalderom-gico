'use client';

import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import CauldronMesh from './CauldronMesh';
import Liquid from './Liquid';
import Steam from './Steam';
import OrbitItems from './OrbitItems';

export default function Scene({
  potion,
  glow,
  motion = 1,
  quality = 'alta',
  opciones,
  seleccion,
  onSelect,
  giro,
}) {
  const { camera, size } = useThree();
  const compacto = size.width < 900;
  const grupo = useRef(null);
  const luzPocion = useRef(null);
  const luzContra = useRef(null);

  const brilloDestino = useMemo(() => new THREE.Color(glow), [glow]);
  const puntero = useRef({
    position: new THREE.Vector2(0, 0),
    strength: 0,
    previous: new THREE.Vector2(),
  });

  // la cámara mira al interior del caldero, no al centro de la escena
  camera.lookAt(0, 0.42, 0);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;

    // el puntero, llevado al plano del líquido
    const objetivo = puntero.current.position;
    const siguienteX = x * 1.1;
    const siguienteY = -y * 1.1;
    const recorrido = Math.hypot(
      siguienteX - puntero.current.previous.x,
      siguienteY - puntero.current.previous.y,
    );
    puntero.current.previous.set(siguienteX, siguienteY);
    objetivo.set(siguienteX, siguienteY);

    puntero.current.strength = THREE.MathUtils.lerp(
      puntero.current.strength,
      Math.min(1, recorrido * 22),
      Math.min(1, delta * 4),
    );

    // La órbita nunca se para: gira sola y el arrastre le suma impulso,
    // que se va frenando como si tuviera peso.
    const g = giro.current;
    g.angulo += (0.16 * motion + g.velocidad) * delta;
    g.velocidad *= Math.max(0, 1 - delta * 2.4);

    // el empuje del arrastre sobre el caldero se va soltando: vuelve solo
    g.caldero *= Math.max(0, 1 - delta * 1.1);

    if (grupo.current) {
      // balanceo lento y continuo, más lo que le haya empujado el arrastre
      const balanceo = Math.sin(state.clock.elapsedTime * 0.24) * 0.3 * motion;
      grupo.current.rotation.y = balanceo + THREE.MathUtils.clamp(g.caldero, -0.75, 0.75);
      if (motion > 0) {
        grupo.current.rotation.x = THREE.MathUtils.lerp(
          grupo.current.rotation.x,
          -y * 0.07,
          Math.min(1, delta * 2),
        );
        grupo.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02 - 0.35;
      }
    }

    if (luzPocion.current) {
      luzPocion.current.color.lerp(brilloDestino, Math.min(1, delta * 2.2));
      const parpadeo =
        1 +
        Math.sin(state.clock.elapsedTime * 3.1) * 0.08 +
        Math.sin(state.clock.elapsedTime * 7.7) * 0.04;
      luzPocion.current.intensity = 13 * parpadeo;
    }
    if (luzContra.current) {
      luzContra.current.color.lerp(brilloDestino, Math.min(1, delta * 2.2));
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#9db3cf" />

      {/* luz principal alta por la izquierda, como en las referencias */}
      <directionalLight position={[-4, 5.5, 3]} intensity={3.4} color="#ffe6c4" />

      {/* contraluz cálido que separa el caldero del fondo */}
      <pointLight ref={luzContra} position={[3.2, 1.8, -3]} intensity={14} distance={14} />

      {/* la poción iluminando el labio y las asas desde dentro */}
      <pointLight ref={luzPocion} position={[0, 0.95, 0]} intensity={13} distance={6.5} decay={2} />

      {/* en vertical los objetos en órbita salen diminutos y sin etiqueta:
          ahí el menú son las tarjetas, y el objeto elegido aparece al abrir */}
      <Suspense fallback={null}>
        {(!compacto || seleccion) && (
        <OrbitItems
          opciones={opciones}
          seleccion={seleccion}
          onSelect={onSelect}
          giro={giro}
          motion={motion}
          compacto={compacto}
        />
        )}
      </Suspense>

      <group ref={grupo} position={[0, -0.35, 0]}>
        <Suspense fallback={null}>
          <CauldronMesh />
        </Suspense>
        <Liquid color={potion} glow={glow} motion={motion} pointer={puntero} />
        {quality !== 'baja' && (
          <Steam glow={glow} motion={motion} count={quality === 'media' ? 320 : 700} />
        )}
      </group>
    </>
  );
}
