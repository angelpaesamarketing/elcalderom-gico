'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  attribute vec3 aOrigen;
  varying float vAlpha;

  void main() {
    float vida = fract(uTime * (0.03 + aSeed * 0.05) + aSeed);

    vec3 pos = aOrigen;
    pos.y += vida * 7.0;
    // la corriente de aire las mece mientras suben
    pos.x += sin(uTime * 0.4 + aSeed * 24.0) * 0.5 * vida;
    pos.z += cos(uTime * 0.33 + aSeed * 17.0) * 0.4 * vida;

    vAlpha = smoothstep(0.0, 0.08, vida) * (1.0 - smoothstep(0.45, 1.0, vida));
    // las de delante titilan
    vAlpha *= 0.55 + 0.45 * sin(uTime * 3.0 + aSeed * 40.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.5 + aSeed) * (10.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // punto redondo y difuso, sin textura
    float d = length(gl_PointCoord - 0.5);
    float forma = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor * 2.2, forma * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
    #include <colorspace_fragment>
  }
`;

// Brasas suspendidas en toda la sala. No son el vapor del caldero: estas
// llenan el aire y dan profundidad a la escena entera.
export default function Brasas({ glow, cantidad = 260, motion = 1 }) {
  const material = useRef(null);
  const destino = useMemo(() => new THREE.Color(glow), [glow]);

  const geometria = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posiciones = new Float32Array(cantidad * 3);
    const origenes = new Float32Array(cantidad * 3);
    const semillas = new Float32Array(cantidad);

    for (let i = 0; i < cantidad; i += 1) {
      origenes[i * 3] = (Math.random() - 0.5) * 11;
      origenes[i * 3 + 1] = -1.5 + Math.random() * 1.5;
      origenes[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
      semillas[i] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    geo.setAttribute('aOrigen', new THREE.BufferAttribute(origenes, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(semillas, 1));
    return geo;
  }, [cantidad]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 7 },
      uColor: { value: new THREE.Color(glow) },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value += delta * motion;
    material.current.uniforms.uColor.value.lerp(destino, Math.min(1, delta * 1.6));
  });

  return (
    <points geometry={geometria} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
