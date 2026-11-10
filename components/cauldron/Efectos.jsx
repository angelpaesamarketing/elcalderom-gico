'use client';

import { Bloom, EffectComposer, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// El bloom es lo que convierte una poción naranja en una poción que ilumina
// la habitación: todo lo que pasa de cierto brillo derrama luz alrededor.
export default function Efectos({ calidad = 'alta' }) {
  if (calidad === 'baja') return null;

  return (
    <EffectComposer disableNormalPass multisampling={calidad === 'alta' ? 4 : 0}>
      <Bloom
        intensity={calidad === 'alta' ? 1.15 : 0.9}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.35}
        mipmapBlur
        radius={0.72}
      />
      {calidad === 'alta' ? (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0006, 0.0009]}
          radialModulation
          modulationOffset={0.35}
        />
      ) : (
        <></>
      )}
      <Vignette offset={0.26} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
