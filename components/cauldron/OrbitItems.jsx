'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';

// La órbita es elíptica: aplastada en profundidad para que el objeto de
// delante no se eche encima de la cámara. En vertical no cabe lo mismo, así
// que se encoge y se sube por encima del caldero.
const ANCHA = { radio: 2.55, hondura: 0.5, altura: 1.3, tamano: 0.62 };
const ESTRECHA = { radio: 1.38, hondura: 0.52, altura: 2.5, tamano: 0.48 };

// Sitio donde se queda el objeto elegido: arriba a la derecha del caldero,
// lejos del panel de texto.
const DESTINO_ANCHA = new THREE.Vector3(1.6, 1.45, 0.75);
const DESTINO_ESTRECHA = new THREE.Vector3(0.0, 3.95, 0.3);

// Halo cálido para la opción destacada: un degradado radial dibujado a mano
// sale más barato que cargar otra imagen.
function crearHalo() {
  const lado = 128;
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = lado;
  const ctx = lienzo.getContext('2d');
  const grad = ctx.createRadialGradient(lado / 2, lado / 2, 0, lado / 2, lado / 2, lado / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.2)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, lado, lado);
  const textura = new THREE.CanvasTexture(lienzo);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

function Orbe({ opcion, textura, indice, total, seleccion, onSelect, giro, motion, forma, destino: DESTINO, compacto }) {
  const grupo = useRef(null);
  const sprite = useRef(null);
  const halo = useRef(null);
  const etiqueta = useRef(null);
  const texturaHalo = useMemo(() => (opcion.destacado ? crearHalo() : null), [opcion.destacado]);
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

    // la opción destacada se ve más grande: es a donde queremos que vayan
    const realce = opcion.destacado ? 1.3 : 1;
    const base =
      forma.tamano * opcion.escala * realce * (elegido ? 1.2 : 1) * (encima && !seleccion ? 1.18 : 1);
    const escala = base * (1 - fuera.current);
    s.scale.setScalar(Math.max(0.001, escala));

    // los de atrás se apagan un poco para que la órbita tenga profundidad
    const profundidad = THREE.MathUtils.mapLinear(Math.sin(angulo), -1, 1, 0.45, 1);
    const opacidad = (1 - fuera.current) * (elegido ? 1 : profundidad);
    s.material.opacity = THREE.MathUtils.lerp(s.material.opacity, opacidad, paso);

    if (halo.current) {
      // late despacio, como la poción
      const latido = 1 + Math.sin(t * 1.6) * 0.12;
      halo.current.scale.setScalar(Math.max(0.001, escala * 3.6 * latido));
      halo.current.material.opacity = (1 - fuera.current) * (0.62 + Math.sin(t * 1.6) * 0.18);
    }

    // La etiqueta se apaga con su objeto. En vertical no caben seis a la vez
    // sin pisarse, así que solo se lee la del objeto que pasa por delante.
    if (etiqueta.current) {
      const frontal = Math.sin(angulo);
      // la destacada se lee casi siempre: es la que no queremos que se pierdan
      let visible = opcion.destacado
        ? Math.max(0.7, profundidad)
        : compacto
          ? Math.max(0, (frontal - 0.62) / 0.3)
          : Math.max(0.22, (profundidad - 0.4) * 1.9);

      // En vertical el texto se sale por el borde cuando el objeto pasa por
      // el lateral, así que ahí se apaga.
      if (compacto) {
        const lateral = Math.abs(Math.cos(angulo));
        visible *= 1 - THREE.MathUtils.smoothstep(lateral, 0.55, 0.85);
      }
      etiqueta.current.style.opacity = String(Math.min(1, Math.max(0, visible)));
    }
  });

  return (
    <group
      ref={grupo}
      position={[Math.cos((indice / total) * Math.PI * 2) * forma.radio, forma.altura, 0]}
    >
      {texturaHalo && (
        <sprite ref={halo} scale={0.001}>
          <spriteMaterial
            map={texturaHalo}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}

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

      {!seleccion && (
        // sin distanceFactor la etiqueta mantiene su tamaño en pantalla
        <Html center position={[0, -0.52, 0]} style={{ pointerEvents: 'none' }}>
          <span
            ref={etiqueta}
            className="orbe-etiqueta"
            data-encima={encima}
            data-destacado={Boolean(opcion.destacado)}
          >
            {opcion.destacado ? 'Reservar' : opcion.nav}
          </span>
        </Html>
      )}
    </group>
  );
}

export default function OrbitItems({ opciones, seleccion, onSelect, giro, motion = 1, compacto }) {
  const texturas = useTexture(opciones.map((o) => `/recortables/${o.icon}.webp`));
  const { gl } = useThree();
  const forma = compacto ? ESTRECHA : ANCHA;
  const destino = compacto ? DESTINO_ESTRECHA : DESTINO_ANCHA;

  useMemo(() => {
    texturas.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
    });
  }, [texturas, gl]);

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
