'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';

// En ancho la órbita es horizontal y elíptica: aplastada en profundidad para
// que el objeto de delante no se eche encima de la cámara.
const ANCHA = { vertical: false, radio: 2.55, hondura: 0.5, altura: 1.3, tamano: 0.62 };

// En vertical gira como una noria, en el plano de la pantalla: así los seis
// objetos se ven enteros todo el rato, cada uno con su nombre. La elipse es
// más alta que ancha para dejar sitio a las etiquetas en los lados.
const ESTRECHA = {
  vertical: true,
  radioX: 0.88,
  radioY: 1.2,
  centro: 2.58,
  tamano: 0.46,
};

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
  const centro = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = grupo.current;
    const s = sprite.current;
    if (!g || !s) return;

    const paso = Math.min(1, delta * 3.4);
    fuera.current = THREE.MathUtils.lerp(fuera.current, descartado ? 1 : 0, paso);

    const t = state.clock.elapsedTime;
    const angulo = (indice / total) * Math.PI * 2 + giro.current.angulo;

    // posición en la órbita, con su propio balanceo
    const vaiven = Math.sin(t * 0.8 + indice * 1.7) * 0.11 * motion;

    if (forma.vertical) {
      // noria: el círculo vive en el plano de la pantalla
      posicion.set(
        Math.cos(angulo) * forma.radioX,
        forma.centro + Math.sin(angulo) * forma.radioY + vaiven * 0.5,
        0,
      );
      centro.set(0, forma.centro, 0);
    } else {
      posicion.set(
        Math.cos(angulo) * forma.radio,
        forma.altura + vaiven * 1.6,
        Math.sin(angulo) * forma.radio * forma.hondura,
      );
      centro.set(0, forma.altura, 0);
    }

    if (elegido) {
      destino.copy(DESTINO);
      destino.y += Math.sin(t * 0.9) * 0.08 * motion;
    } else if (descartado) {
      // ¡pum!: sale despedido hacia fuera, alejándose del centro del círculo
      destino.subVectors(posicion, centro).multiplyScalar(5).add(centro);
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

    // en la noria no hay delante ni detrás: todos se ven por igual
    const profundidad = forma.vertical
      ? 1
      : THREE.MathUtils.mapLinear(Math.sin(angulo), -1, 1, 0.45, 1);
    const opacidad = (1 - fuera.current) * (elegido ? 1 : profundidad);
    s.material.opacity = THREE.MathUtils.lerp(s.material.opacity, opacidad, paso);

    if (halo.current) {
      // late despacio, como la poción
      const latido = 1 + Math.sin(t * 1.6) * 0.12;
      halo.current.scale.setScalar(Math.max(0.001, escala * 3.6 * latido));
      halo.current.material.opacity = (1 - fuera.current) * (0.62 + Math.sin(t * 1.6) * 0.18);
    }

    // En la noria se lee siempre el nombre de los seis: es justo lo que
    // tiene que resolver. En horizontal se apagan los que quedan detrás.
    if (etiqueta.current) {
      const visible = forma.vertical
        ? 1
        : opcion.destacado
          ? Math.max(0.7, profundidad)
          : Math.max(0.22, (profundidad - 0.4) * 1.9);
      etiqueta.current.style.opacity = String(Math.min(1, Math.max(0, visible)));
    }
  });

  return (
    <group
      ref={grupo}
      position={
        forma.vertical
          ? [
              Math.cos((indice / total) * Math.PI * 2) * forma.radioX,
              forma.centro + Math.sin((indice / total) * Math.PI * 2) * forma.radioY,
              0,
            ]
          : [Math.cos((indice / total) * Math.PI * 2) * forma.radio, forma.altura, 0]
      }
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
        <Html
          center
          position={[0, forma.vertical ? -0.42 : -0.52, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <span
            ref={etiqueta}
            className="orbe-etiqueta"
            data-encima={encima}
            data-destacado={Boolean(opcion.destacado)}
          >
            {opcion.destacado ? 'Reservar' : compacto && opcion.corto ? opcion.corto : opcion.nav}
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
