'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Sprite redondo y difuso: dibujarlo sale más barato que cargar un PNG.
function makePuffTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.22)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  attribute float aSpeed;
  varying float vAlpha;
  varying float vLife;

  void main() {
    // cada partícula recorre su ciclo y vuelve a empezar
    float life = fract(uTime * aSpeed * 0.12 + aSeed);
    vLife = life;

    float angle = aSeed * 6.2831853;
    // sale de la boca del caldero y se abre al subir
    float spread = 0.18 + life * 0.95;
    float wobble = sin(uTime * 0.7 + aSeed * 12.0 + life * 5.0) * 0.16 * life;

    vec3 pos;
    pos.x = cos(angle) * spread * (0.4 + aSeed * 0.6) + wobble;
    pos.z = sin(angle) * spread * (0.4 + aSeed * 0.6) + wobble * 0.7;
    pos.y = 0.86 + life * 2.4;

    // entra y se deshace
    vAlpha = smoothstep(0.0, 0.1, life) * (1.0 - smoothstep(0.25, 0.95, life)) * 0.6;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.5 + life * 2.2) * (14.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec3 uColor;
  uniform vec3 uGlow;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec4 tex = texture2D(uTexture, gl_PointCoord);
    // abajo el vapor recoge la luz de la poción, arriba se enfría
    vec3 color = mix(uGlow, uColor, smoothstep(0.0, 0.5, vLife));
    gl_FragColor = vec4(color, tex.a * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
    #include <colorspace_fragment>
  }
`;

export default function Steam({ glow, count = 1100, motion = 1 }) {
  const materialRef = useRef(null);
  const targetGlow = useMemo(() => new THREE.Color(glow), [glow]);
  const texture = useMemo(() => makePuffTexture(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      seeds[i] = Math.random();
      speeds[i] = 0.6 + Math.random() * 0.9;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 5.5 },
      uTexture: { value: texture },
      uColor: { value: new THREE.Color('#b9b0a6') },
      uGlow: { value: new THREE.Color(glow) },
    }),
    [texture],
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta * motion;
    mat.uniforms.uGlow.value.lerp(targetGlow, Math.min(1, delta * 2.2));
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  );
}
