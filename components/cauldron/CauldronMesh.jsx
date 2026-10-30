'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Perfil del caldero, medido sobre las referencias de assets/raw/caldero.
// Recorre el exterior desde el centro del fondo, pasa por el labio y
// vuelve a bajar por la pared interior, así la pieza queda cerrada.
const PERFIL = [
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

const ANGULOS_PATAS = [
  Math.PI / 2,
  Math.PI / 2 + (2 * Math.PI) / 3,
  Math.PI / 2 + (4 * Math.PI) / 3,
];
const ANGULOS_ASAS = [0, Math.PI];

// El torno cierra la vuelta duplicando vértices, y ahí las normales quedan
// sin promediar: se ve una arista de luz recorriendo la panza. Promediarlas
// por posición las cose sin tocar las UV, que sí deben seguir partidas.
function suavizarNormales(geometria) {
  geometria.computeVertexNormals();

  const posiciones = geometria.attributes.position;
  const normales = geometria.attributes.normal;
  const grupos = new Map();

  for (let i = 0; i < posiciones.count; i += 1) {
    const clave = [
      Math.round(posiciones.getX(i) * 1e4),
      Math.round(posiciones.getY(i) * 1e4),
      Math.round(posiciones.getZ(i) * 1e4),
    ].join('_');

    let grupo = grupos.get(clave);
    if (!grupo) {
      grupo = { suma: new THREE.Vector3(), indices: [] };
      grupos.set(clave, grupo);
    }
    grupo.suma.x += normales.getX(i);
    grupo.suma.y += normales.getY(i);
    grupo.suma.z += normales.getZ(i);
    grupo.indices.push(i);
  }

  grupos.forEach(({ suma, indices }) => {
    suma.normalize();
    indices.forEach((i) => normales.setXYZ(i, suma.x, suma.y, suma.z));
  });

  normales.needsUpdate = true;
  return geometria;
}

// Asa de hierro: un tubo que sale del hombro, se abre hacia fuera y vuelve
// a entrar más abajo. Un toro no servía: las asas reales no son un anillo.
function crearAsa() {
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.78, 1.045, 0),
    new THREE.Vector3(1.08, 1.07, 0),
    new THREE.Vector3(1.27, 0.95, 0),
    new THREE.Vector3(1.17, 0.83, 0),
    new THREE.Vector3(0.93, 0.815, 0),
  ]);
  return new THREE.TubeGeometry(curva, 64, 0.04, 14, false);
}

export default function CauldronMesh() {
  const hierro = useTexture('/textures/hierro.webp');

  const cuerpo = useMemo(() => {
    const puntos = PERFIL.map(([x, y]) => new THREE.Vector2(x, y));
    return suavizarNormales(new THREE.LatheGeometry(puntos, 160));
  }, []);

  const asa = useMemo(() => crearAsa(), []);

  const material = useMemo(() => {
    hierro.wrapS = hierro.wrapT = THREE.MirroredRepeatWrapping;
    hierro.repeat.set(4, 2);
    hierro.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: hierro,
      bumpMap: hierro,
      bumpScale: 0.06,
      color: '#8a7d70',
      roughness: 0.62,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
  }, [hierro]);

  return (
    <group>
      <mesh geometry={cuerpo} material={material} />

      {ANGULOS_PATAS.map((angulo, i) => (
        <group key={`pata-${i}`} rotation={[0, angulo, 0]}>
          <mesh material={material} position={[0.58, -0.13, 0]} rotation={[0, 0, 0.21]}>
            <cylinderGeometry args={[0.105, 0.072, 0.48, 20]} />
          </mesh>
        </group>
      ))}

      {ANGULOS_ASAS.map((angulo, i) => (
        <group key={`asa-${i}`} rotation={[0, angulo, 0]}>
          <mesh geometry={asa} material={material} />
          {/* remaches de los dos extremos */}
          <mesh material={material} position={[0.78, 1.045, 0]}>
            <sphereGeometry args={[0.055, 18, 14]} />
          </mesh>
          <mesh material={material} position={[0.93, 0.815, 0]}>
            <sphereGeometry args={[0.055, 18, 14]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
