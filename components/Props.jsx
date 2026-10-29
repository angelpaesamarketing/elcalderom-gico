'use client';

// Objetos recortados que flotan sobre el fondo de cada sección.
// Van en DOM y no en la escena 3D: son imágenes planas, salen más nítidas,
// pesan poco y no le cuestan nada a la GPU.
//
// Cada objeto se envuelve en un span porque hacen falta dos movimientos a la
// vez: el span deriva solo (su propia animación) y la imagen se desplaza con
// el scroll según su profundidad.
export default function Props({ items = [], visible }) {
  if (!items.length) return null;

  return (
    <div className="objetos" aria-hidden="true">
      {items.map((item, indice) => (
        <span
          key={`${item.src}-${indice}`}
          className="objeto-deriva"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: `${indice * 1.9}s`,
          }}
        >
          <img
            className="objeto"
            src={`/recortables/${item.src}.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            data-visible={visible}
            style={{
              width: `${item.size}px`,
              filter: item.blur ? `blur(${item.blur}px)` : undefined,
              '--giro': `${item.rotate}deg`,
              '--profundidad': item.depth,
            }}
          />
        </span>
      ))}
    </div>
  );
}
