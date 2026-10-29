'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Perfil del caldero, medido sobre las referencias de assets/raw/caldero.
// Recorre el exterior desde el centro del fondo, pasa por el labio y
// vuelve a bajar por la pared interior, así la pieza queda cerrada.
const PROFILE = [
  [0.0, 0.0],
  [0.3, 0.005],
  [0.55, 0.04],
  [0.78, 0.14],
  [0.93, 0.3],
  [1.0, 0.5],
  [0.985, 0.68],
  [0.925, 0.82],
  [0.845, 0.93],
  [0.795, 1.0],
  // labio
  [0.82, 1.035],
  [0.835, 1.075],
  [0.815, 1.105],
  [0.775, 1.115],
  [0.745, 1.09],
  [0.74, 1.05],
  // pared interior
  [0.735, 1.0],
  [0.78, 0.9],
  [0.855, 0.78],
  [0.915, 0.62],
  [0.93, 0.48],
  [0.87, 0.3],
  [0.72, 0.16],
  [0.5, 0.08],
  [0.26, 0.05],
  [0.0, 0.045],
];

const LEG_ANGLES = [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3];
const HANDLE_ANGLES = [0, Math.PI];

export default function CauldronMesh() {
  const iron = useTexture('/textures/hierro.webp');

  const lathe = useMemo(() => {
    const points = PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(points, 96);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(() => {
    iron.wrapS = iron.wrapT = THREE.MirroredRepeatWrapping;
    iron.repeat.set(4, 2);
    iron.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: iron,
      bumpMap: iron,
      bumpScale: 0.06,
      color: '#8a7d70',
      roughness: 0.62,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
  }, [iron]);

  return (
    <group>
      <mesh geometry={lathe} material={material} castShadow receiveShadow />

      {LEG_ANGLES.map((angle, i) => (
        <group key={`pata-${i}`} rotation={[0, angle, 0]}>
          <mesh
            material={material}
            position={[0.58, -0.13, 0]}
            rotation={[0, 0, 0.21]}
            castShadow
          >
            <cylinderGeometry args={[0.105, 0.072, 0.48, 20]} />
          </mesh>
        </group>
      ))}

      {HANDLE_ANGLES.map((angle, i) => (
        <group key={`asa-${i}`} rotation={[0, angle, 0]}>
          {/* asa fija en arco, remachada por los dos extremos */}
          <mesh material={material} position={[0.93, 0.93, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.165, 0.032, 12, 28, Math.PI * 1.15]} />
          </mesh>
          <mesh material={material} position={[0.89, 1.05, 0]}>
            <sphereGeometry args={[0.052, 16, 12]} />
          </mesh>
          <mesh material={material} position={[0.93, 0.81, 0]}>
            <sphereGeometry args={[0.052, 16, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
