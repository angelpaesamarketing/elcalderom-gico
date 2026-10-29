'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uMotion;

  varying vec2 vUv;
  varying float vHeight;
  varying float vDist;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // el plano llega girado, así que el radio vive en xy
    float dist = length(pos.xy);
    vDist = dist;

    // ondas concéntricas lentas, como un líquido espeso
    float wave = sin(dist * 18.0 - uTime * 1.6) * 0.012;
    wave += sin(dist * 31.0 - uTime * 2.3) * 0.005;

    // borboteo: el centro late
    wave += sin(uTime * 1.1) * 0.006 * (1.0 - dist);

    // la onda que deja el ratón al pasar
    float pointerDist = distance(pos.xy, uPointer);
    wave += sin(pointerDist * 26.0 - uTime * 5.0) * 0.022
          * uPointerStrength
          * smoothstep(0.75, 0.0, pointerDist);

    wave *= uMotion;
    pos.z += wave;
    vHeight = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform float uMotion;

  varying vec2 vUv;
  varying float vHeight;
  varying float vDist;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // burbujas en rejilla: cada celda saca la suya con su ritmo
  float bubbles(vec2 uv, float t) {
    float acc = 0.0;
    for (float i = 0.0; i < 3.0; i += 1.0) {
      float scale = 5.0 + i * 4.0;
      vec2 gv = uv * scale;
      vec2 id = floor(gv);
      vec2 f = fract(gv) - 0.5;

      float rnd = hash(id + i * 17.0);
      float cycle = fract(t * (0.25 + rnd * 0.4) + rnd);
      float radius = 0.05 + rnd * 0.1;
      radius *= smoothstep(0.0, 0.25, cycle) * smoothstep(1.0, 0.75, cycle);

      vec2 offset = vec2(hash(id + 3.0) - 0.5, hash(id + 7.0) - 0.5) * 0.5;
      float d = length(f - offset);

      // anillo brillante con el centro algo más claro
      float ring = smoothstep(radius, radius * 0.72, d) - smoothstep(radius * 0.72, radius * 0.3, d) * 0.55;
      acc += max(ring, 0.0);
    }
    return clamp(acc, 0.0, 1.0);
  }

  void main() {
    // la poción emite luz desde el fondo del caldero
    float core = 1.0 - smoothstep(0.0, 0.95, vDist);
    vec3 color = mix(uColor, uGlow, pow(core, 1.5)) * 1.25;

    // las ondas se leen como brillos
    color += uGlow * clamp(vHeight * 14.0, -0.35, 0.9);

    // partículas en suspensión
    float motes = hash(floor(vUv * 180.0) + floor(uTime * 1.5));
    color += uGlow * step(0.994, motes) * 0.6;

    color += uGlow * bubbles(vUv, uTime * uMotion) * 0.3;

    // se apaga contra la pared del caldero
    float edge = smoothstep(1.0, 0.72, vDist);
    color *= mix(0.62, 1.15, edge);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function Liquid({ color, glow, motion = 1, pointer }) {
  const materialRef = useRef(null);
  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const targetGlow = useMemo(() => new THREE.Color(glow), [glow]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uGlow: { value: new THREE.Color(glow) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uMotion: { value: motion },
    }),
    [],
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const u = mat.uniforms;
    u.uTime.value += delta * motion;
    u.uMotion.value = motion;

    // el color de la poción no salta: se funde con el de la sección
    u.uColor.value.lerp(targetColor, Math.min(1, delta * 2.2));
    u.uGlow.value.lerp(targetGlow, Math.min(1, delta * 2.2));

    if (pointer?.current) {
      u.uPointer.value.lerp(pointer.current.position, Math.min(1, delta * 6));
      u.uPointerStrength.value = THREE.MathUtils.lerp(
        u.uPointerStrength.value,
        pointer.current.strength,
        Math.min(1, delta * 3),
      );
    }
  });

  return (
    <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.84, 128]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        toneMapped={false}
      />
    </mesh>
  );
}
