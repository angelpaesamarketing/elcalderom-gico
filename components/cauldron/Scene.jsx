'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import CauldronMesh from './CauldronMesh';
import Liquid from './Liquid';
import Steam from './Steam';
import OrbitItems from './OrbitItems';
import Brasas from './Brasas';
import Suelo from './Suelo';
import Onda from './Onda';

// Dónde descansa la cámara, y de dónde baja al entrar. La entrada cae desde
// arriba, como si te asomaras al caldero antes de retirarte a ver la sala.
const REPOSO = {
  ancha: { camara: [0, 2.15, 5.1], mira: [0, 0.42, 0] },
  estrecha: { camara: [0, 2.25, 7.4], mira: [0, 2.15, 0] },
};
const ENTRADA = {
  ancha: { camara: [0, 7.2, 1.9], mira: [0, 0.9, 0] },
  estrecha: { camara: [0, 8.4, 2.4], mira: [0, 0.9, 0] },
};

const suavizar = (x) => 1 - Math.pow(1 - x, 3);

export default function Scene({
  potion,
  glow,
  motion = 1,
  quality = 'alta',
  opciones,
  seleccion,
  onSelect,
  giro,
  volar,
}) {
  const { camera, size } = useThree();
  const compacto = size.width < 900;
  const marco = compacto ? 'estrecha' : 'ancha';

  const grupo = useRef(null);
  const luzPocion = useRef(null);
  const luzContra = useRef(null);

  const brilloDestino = useMemo(() => new THREE.Color(glow), [glow]);
  const puntero = useRef({
    position: new THREE.Vector2(0, 0),
    strength: 0,
    previous: new THREE.Vector2(),
  });

  // 0 al empezar, 1 cuando la cámara ya está en su sitio
  const vuelo = useRef(0);
  const mira = useMemo(() => new THREE.Vector3(), []);
  const desde = useMemo(() => new THREE.Vector3(), []);
  const hasta = useMemo(() => new THREE.Vector3(), []);

  // fogonazo al elegir una opción
  const fogonazo = useRef(0);
  useEffect(() => {
    if (seleccion) fogonazo.current = 1;
  }, [seleccion]);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;

    // --- cámara ---
    // la caída no arranca hasta que hay algo que mirar
    if (volar && vuelo.current < 1) {
      vuelo.current = Math.min(1, vuelo.current + delta * (motion > 0 ? 0.42 : 4));
    }
    const p = suavizar(vuelo.current);

    desde.fromArray(ENTRADA[marco].camara);
    hasta.fromArray(REPOSO[marco].camara);
    // con una opción abierta el caldero se aparta del panel
    const apartar = seleccion && !compacto ? 0.55 : 0;
    camera.position.lerpVectors(desde, hasta, p);
    camera.position.x += apartar * 0.4;
    // respiración de cámara, para que nunca parezca una foto
    if (motion > 0) {
      camera.position.x += Math.sin(state.clock.elapsedTime * 0.21) * 0.07;
      camera.position.y += Math.sin(state.clock.elapsedTime * 0.17) * 0.05;
    }

    desde.fromArray(ENTRADA[marco].mira);
    hasta.fromArray(REPOSO[marco].mira);
    mira.lerpVectors(desde, hasta, p);
    mira.x -= apartar;
    camera.lookAt(mira);

    // --- puntero sobre la poción ---
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

    // --- órbita y caldero ---
    const g = giro.current;
    g.angulo += (0.16 * motion + g.velocidad) * delta;
    g.velocidad *= Math.max(0, 1 - delta * 2.4);
    g.caldero *= Math.max(0, 1 - delta * 1.1);

    if (grupo.current) {
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

    // --- luces ---
    fogonazo.current = Math.max(0, fogonazo.current - delta * 1.7);

    if (luzPocion.current) {
      luzPocion.current.color.lerp(brilloDestino, Math.min(1, delta * 2.2));
      const parpadeo =
        1 +
        Math.sin(state.clock.elapsedTime * 3.1) * 0.08 +
        Math.sin(state.clock.elapsedTime * 7.7) * 0.04;
      // el fogonazo del cambio se suma al hervor de siempre
      luzPocion.current.intensity = 13 * parpadeo * (1 + fogonazo.current * 2.6) * p;
    }
    if (luzContra.current) {
      luzContra.current.color.lerp(brilloDestino, Math.min(1, delta * 2.2));
      luzContra.current.intensity = 14 * p;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#9db3cf" />
      <directionalLight position={[-4, 5.5, 3]} intensity={3.4} color="#ffe6c4" />
      <pointLight ref={luzContra} position={[3.2, 1.8, -3]} intensity={14} distance={14} />
      <pointLight ref={luzPocion} position={[0, 0.95, 0]} intensity={13} distance={6.5} decay={2} />

      {quality !== 'baja' && <Brasas glow={glow} motion={motion} cantidad={quality === 'media' ? 130 : 260} />}

      <Suspense fallback={null}>
        <OrbitItems
          opciones={opciones}
          seleccion={seleccion}
          onSelect={onSelect}
          giro={giro}
          motion={motion}
          compacto={compacto}
        />
      </Suspense>

      <group ref={grupo} position={[0, -0.35, 0]}>
        <Suelo glow={glow} motion={motion} />
        <Onda disparo={seleccion} glow={glow} motion={motion} />
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
