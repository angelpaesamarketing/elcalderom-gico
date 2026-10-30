'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';

// La órbita es elíptica: aplastada en profundidad para que el objeto de
// delante no se eche encima de la cámara. En vertical no cabe lo mismo, así
// que se encoge y se sube por encima del caldero.
const ANCHA = { radio: 2.55, hondura: 0.5, altura: 1.3, tamano: 0.62 };
const ESTRECHA = { radio: 1.5, hondura: 0.55, altura: 2.05, tamano: 0.46 };

// Sitio donde se queda el objeto elegido: arriba a la derecha del caldero,
// lejos del panel de texto.
const DESTINO_ANCHA = new THREE.Vector3(1.6, 1.45, 0.75);
const DESTINO_ESTRECHA = new THREE.Vector3(0.72, 2.25, 0.5);

function Orbe({ opcion, textura, indice, total, seleccion, onSelect, giro, motion, forma, destino: DESTINO, compacto }) {
  const grupo = useRef(null);
  const sprite = useRef(null);
  const etiqueta = useRef(null);
  const [encima, setEncima] = useState(false);

  const elegido = seleccion === opcion.id;
  const descartado = Boolean(seleccion) && !elegido;

  // 0 mientras orbita, 1 cuando ya ha salido disparado
  const fuera = useRef(0);
  const posicion = useMemo(() => new THREE.Vector3(), []);
  const destino = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = grupo.current;
    const s = sprite.current;
    if (!g || !s) return;

    const paso = Math.min(1, delta * 3.4);
    fuera.current = THREE.MathUtils.lerp(fuera.current, descartado ? 1 : 0, paso);

    const t = state.clock.elapsedTime;
    const angulo = (indice / total) * Math.PI * 2 + giro.current.angulo;

    // posición en la órbita, con su propio balanceo
    posicion.set(
      Math.cos(angulo) * forma.radio,
      forma.altura + Math.sin(t * 0.8 + indice * 1.7) * 0.18 * motion,
      Math.sin(angulo) * forma.radio * forma.hondura,
    );

    if (elegido) {
      destino.copy(DESTINO);
      destino.y += Math.sin(t * 0.9) * 0.08 * motion;
    } else if (descartado) {
      // ¡pum!: sale despedido hacia fuera por donde estaba
      destino.copy(posicion).multiplyScalar(4.5);
    } else {
      destino.copy(posicion);
    }

    g.position.lerp(destino, Math.min(1, delta * (descartado ? 5 : 3)));

    const base = forma.tamano * opcion.escala * (elegido ? 1.2 : 1) * (encima && !seleccion ? 1.18 : 1);
    const escala = base * (1 - fuera.current);
    s.scale.setScalar(Math.max(0.001, escala));

    // los de atrás se apagan un poco para que la órbita tenga profundidad
    const profundidad = THREE.MathUtils.mapLinear(Math.sin(angulo), -1, 1, 0.45, 1);
    const opacidad = (1 - fuera.current) * (elegido ? 1 : profundidad);
    s.material.opacity = THREE.MathUtils.lerp(s.material.opacity, opacidad, paso);

    // la etiqueta se apaga con su objeto, si no queda flotando sola
    if (etiqueta.current) {
      etiqueta.current.style.opacity = String(Math.max(0.22, (profundidad - 0.4) * 1.9));
    }
  });

  return (
    <group
      ref={grupo}
      position={[Math.cos((indice / total) * Math.PI * 2) * forma.radio, forma.altura, 0]}
    >
      <sprite
        ref={sprite}
        scale={0.001}
        onClick={(evento) => {
          evento.stopPropagation();
          // si venía de arrastrar la órbita no es un clic, es un gesto
          if (!seleccion && giro.current.arrastre < 7) onSelect(opcion.id);
        }}
        onPointerOver={(evento) => {
          evento.stopPropagation();
          if (!seleccion) {
            setEncima(true);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          setEncima(false);
          document.body.style.cursor = '';
        }}
      >
        <spriteMaterial map={textura} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </sprite>

      {!seleccion && !compacto && (
        // sin distanceFactor la etiqueta mantiene su tamaño en pantalla
        <Html center position={[0, -0.52, 0]} style={{ pointerEvents: 'none' }}>
          <span ref={etiqueta} className="orbe-etiqueta" data-encima={encima}>
            {opcion.nav}
          </span>
        </Html>
      )}
    </group>
  );
}

export default function OrbitItems({ opciones, seleccion, onSelect, giro, motion = 1, compacto }) {
  const texturas = useTexture(opciones.map((o) => `/recortables/${o.icon}.webp`));
  const forma = compacto ? ESTRECHA : ANCHA;
  const destino = compacto ? DESTINO_ESTRECHA : DESTINO_ANCHA;

  useMemo(() => {
    texturas.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [texturas]);

  return (
    <group>
      {opciones.map((opcion, indice) => (
        <Orbe
          key={opcion.id}
          opcion={opcion}
          textura={texturas[indice]}
          indice={indice}
          total={opciones.length}
          seleccion={seleccion}
          onSelect={onSelect}
          giro={giro}
          motion={motion}
          forma={forma}
          destino={destino}
          compacto={compacto}
        />
      ))}
    </group>
  );
}
