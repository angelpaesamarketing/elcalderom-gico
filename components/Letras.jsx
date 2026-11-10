'use client';

// Materializa un texto letra a letra. Se parte por palabras para que el
// salto de línea siga siendo el del navegador.
export default function Letras({ texto, retardo = 0, paso = 0.028 }) {
  let n = 0;

  return (
    <span className="letras" aria-label={texto}>
      {texto.split(' ').map((palabra, p) => (
        <span className="letras-palabra" key={`${palabra}-${p}`} aria-hidden="true">
          {[...palabra].map((letra, i) => {
            n += 1;
            return (
              <span
                className="letra"
                key={`${letra}-${i}`}
                style={{ animationDelay: `${retardo + n * paso}s` }}
              >
                {letra}
              </span>
            );
          })}
          {p < texto.split(' ').length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
