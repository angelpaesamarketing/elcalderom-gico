'use client';

import { useMemo, useState } from 'react';
import { TIPOS_RESERVA } from '@/lib/experiencias';
import { LOCAL } from '@/lib/local';
import { medir } from '@/lib/medir';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function hoy() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

// Medias horas entre la primera y la última a la que se puede pedir sitio.
function franjas([desde, hasta]) {
  const aMinutos = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
  const lista = [];
  for (let m = aMinutos(desde); m <= aMinutos(hasta); m += 30) {
    lista.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return lista;
}

// Solicitud de reserva. No consulta disponibilidad: compone el mensaje y lo
// manda al local por WhatsApp o por correo, que es quien confirma. Por eso
// en ningún sitio dice "reserva confirmada".
export default function Reserva({ tipoInicial = 'mesa', nota = '' }) {
  const [tipo, setTipo] = useState(tipoInicial);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(2);
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState(nota);

  const elegido = TIPOS_RESERVA.find((t) => t.id === tipo);
  const conFecha = !elegido.sinFecha;

  const dia = fecha ? new Date(`${fecha}T12:00:00`) : null;
  const apertura = dia ? LOCAL.apertura[dia.getDay()] : null;
  const cerrado = Boolean(dia) && !apertura;
  const horas = useMemo(() => (apertura ? franjas(apertura) : []), [apertura]);

  const fechaLarga = dia
    ? `${DIAS[dia.getDay()]} ${dia.getDate()} de ${MESES[dia.getMonth()]}`
    : '';

  const completo =
    nombre.trim().length > 1 && (!conFecha || (fecha && !cerrado && hora && horas.includes(hora)));

  const mensaje = [
    `Hola, soy ${nombre.trim() || '…'}.`,
    tipo === 'regalo'
      ? 'Quiero una tarjeta regalo de El Caldero Mágico.'
      : `Quiero reservar: ${elegido.nombre.toLowerCase()}.`,
    conFecha && fecha && !cerrado ? `Día: ${fechaLarga}${hora ? ` a las ${hora}` : ''}.` : null,
    conFecha ? `Personas: ${personas}.` : null,
    comentario.trim() ? `Nota: ${comentario.trim()}` : null,
    '¿Me confirmáis? ¡Gracias!',
  ]
    .filter(Boolean)
    .join('\n');

  const enviar = (canal) => medir('reserva_solicitada', { canal, tipo, personas });

  const whatsapp = `https://wa.me/${LOCAL.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  const correo = `mailto:${LOCAL.correo}?subject=${encodeURIComponent(
    `Reserva · ${elegido.nombre}${fechaLarga ? ` · ${fechaLarga}` : ''}`,
  )}&body=${encodeURIComponent(mensaje)}`;

  return (
    <form className="reserva" onSubmit={(evento) => evento.preventDefault()}>
      <fieldset className="reserva-tipos">
        <legend>¿Qué quieres reservar?</legend>
        {TIPOS_RESERVA.map((t) => (
          <label key={t.id} data-activo={t.id === tipo}>
            <input
              type="radio"
              name="tipo"
              value={t.id}
              checked={t.id === tipo}
              onChange={() => setTipo(t.id)}
            />
            <span>{t.nombre}</span>
            <small>{t.pista}</small>
          </label>
        ))}
      </fieldset>

      {conFecha && (
        <>
          <div className="reserva-fila">
            <label className="campo">
              <span>Día</span>
              <input
                type="date"
                min={hoy()}
                value={fecha}
                onChange={(evento) => {
                  setFecha(evento.target.value);
                  setHora('');
                }}
              />
            </label>

            <label className="campo">
              <span>Hora</span>
              <select value={hora} onChange={(evento) => setHora(evento.target.value)} disabled={!horas.length}>
                <option value="">{fecha ? (cerrado ? 'Cerrado' : 'Elige') : 'Elige día'}</option>
                {horas.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {cerrado && (
            <p className="reserva-aviso" role="alert">
              Los lunes y martes descansamos. Abrimos de miércoles a domingo.
            </p>
          )}

          <div className="campo">
            <span id="reserva-personas">Personas</span>
            <div className="contador" role="group" aria-labelledby="reserva-personas">
              <button type="button" onClick={() => setPersonas((n) => Math.max(1, n - 1))} aria-label="Una persona menos">
                −
              </button>
              <output aria-live="polite">{personas}</output>
              <button type="button" onClick={() => setPersonas((n) => Math.min(40, n + 1))} aria-label="Una persona más">
                +
              </button>
            </div>
          </div>

          {personas > 10 && (
            <p className="reserva-aviso">
              Para más de diez lo preparamos a medida: mándanos la solicitud y te llamamos.
            </p>
          )}
        </>
      )}

      <label className="campo">
        <span>Tu nombre</span>
        <input
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="¿A nombre de quién?"
        />
      </label>

      <label className="campo">
        <span>Algo que debamos saber</span>
        <textarea
          rows={2}
          value={comentario}
          onChange={(evento) => setComentario(evento.target.value)}
          placeholder="Alergias, celíacos, silla de ruedas, cumpleaños…"
        />
      </label>

      <div className="reserva-enviar" data-listo={Boolean(completo)}>
        {LOCAL.whatsapp && (
          <a
            className="boton boton-lleno"
            href={completo ? whatsapp : undefined}
            aria-disabled={!completo}
            target="_blank"
            rel="noreferrer"
            onClick={() => completo && enviar('whatsapp')}
          >
            Enviar por WhatsApp
          </a>
        )}
        <a
          className="boton"
          href={completo ? correo : undefined}
          aria-disabled={!completo}
          onClick={() => completo && enviar('correo')}
        >
          Enviar por correo
        </a>
      </div>

      <p className="nota">
        {completo
          ? 'Es una solicitud: la reserva queda hecha cuando te la confirmamos.'
          : conFecha
            ? 'Elige día, hora y pon tu nombre para enviarla.'
            : 'Pon tu nombre para enviarla.'}{' '}
        ¿Prefieres hablar?{' '}
        <a href={LOCAL.telefonoEnlace} onClick={() => enviar('llamada')}>
          Llama al {LOCAL.telefono}
        </a>
        .
      </p>
    </form>
  );
}
