'use client';

import { useMemo, useState } from 'react';
import Pociones from '@/components/Pociones';
import { MAX_POCIONES, POCION, TIPOS_RESERVA } from '@/lib/experiencias';
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

// Solicitud para eventos y grupos, que el local gestiona hablando. No
// consulta disponibilidad: compone el mensaje y lo manda por WhatsApp o por
// correo. Por eso en ningún sitio dice "reserva confirmada".
function Solicitud({ nota }) {
  const tipo = 'evento';
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(12);
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState(nota);

  const elegido = TIPOS_RESERVA.find((t) => t.id === tipo);
  const conFecha = true;

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
    'Quiero organizar un evento o venir en grupo.',
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
      <p className="nota">
        Cumpleaños, empresas, despedidas o más de diez personas: cuéntanos y te lo
        preparamos a medida.
      </p>
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
          placeholder="Qué celebráis, alergias, si queréis clase de pociones…"
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

// Reservar o comprar, en dos pasos:
//  1. La ficha: en qué consiste lo que vas a reservar. En la clase, además,
//     se eligen aquí las dos pociones; en una mesa no se pregunta nada.
//  2. El módulo de CoverManager del local, con disponibilidad y pago reales.
// Los eventos y grupos, que se cierran hablando, van por solicitud.
export default function Reserva({ tipoInicial = 'mesa', nota = '', elegidas, alElegir, alMirar }) {
  const [tipo, setTipo] = useState(tipoInicial);
  const [paso, setPaso] = useState('ficha');
  const [copiado, setCopiado] = useState(false);

  const elegido = TIPOS_RESERVA.find((t) => t.id === tipo) ?? TIPOS_RESERVA[0];
  const esClase = tipo === 'clase';
  const faltan = esClase ? MAX_POCIONES - elegidas.length : 0;

  const elegir = (id) => {
    setTipo(id);
    setPaso('ficha');
    alMirar?.(null);
    medir('reserva_tipo', { tipo: id });
  };

  const continuar = () => {
    setPaso('modulo');
    medir('reserva_modulo', { tipo, pociones: esClase ? elegidas.join('+') : undefined });
  };

  // Lo que el cliente tiene que hacer llegar al local con su reserva. El
  // módulo de CoverManager no se puede rellenar desde fuera, así que se le
  // da el texto listo para pegar en comentarios, o para mandarlo aparte.
  const frase = `Pociones para la clase: ${elegidas.map((id) => POCION[id].nombre).join(' y ')}.`;
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(frase);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="reserva">
      <fieldset className="reserva-tipos">
        <legend>¿Qué quieres?</legend>
        {TIPOS_RESERVA.map((t) => (
          <label key={t.id} data-activo={t.id === tipo}>
            <input
              type="radio"
              name="tipo"
              value={t.id}
              checked={t.id === tipo}
              onChange={() => elegir(t.id)}
            />
            <span>{t.nombre}</span>
            <small>{t.pista}</small>
          </label>
        ))}
      </fieldset>

      {elegido.via === 'solicitud' && <Solicitud nota={nota} />}

      {elegido.via !== 'solicitud' && paso === 'ficha' && (
        <div className="ficha">
          <span className="ficha-paso">Paso 1 de 2 · Qué vas a reservar</span>
          <h3>{elegido.ficha.titulo}</h3>

          {elegido.ficha.datos && (
            <dl className="datos">
              {elegido.ficha.datos.map(([clave, valor]) => (
                <div key={clave}>
                  <dt>{clave}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="ficha-puntos">
            {elegido.ficha.puntos.map((punto) => (
              <li key={punto}>{punto}</li>
            ))}
          </ul>

          {esClase && (
            <div className="ficha-pociones">
              <h3>¿Qué dos pociones vais a preparar?</h3>
              <p className="nota">
                Las elegís ahora para que el local lo tenga todo listo cuando lleguéis.
              </p>
              <Pociones elegidas={elegidas} alCambiar={alElegir} alMirar={alMirar} />
            </div>
          )}

          <button className="boton boton-lleno" type="button" disabled={faltan > 0} onClick={continuar}>
            {faltan > 0
              ? `Elige ${faltan === 1 ? 'una poción más' : 'dos pociones'} para seguir`
              : elegido.ficha.continuar}
          </button>
        </div>
      )}

      {elegido.via !== 'solicitud' && paso === 'modulo' && (
        <>
          <button className="volver" type="button" onClick={() => setPaso('ficha')}>
            ← {esClase ? 'Cambiar pociones' : 'Ver qué incluye'}
          </button>
          <span className="ficha-paso">Paso 2 de 2 · Día y hora</span>

          {esClase && (
            <div className="reserva-aviso recado">
              <strong>{frase}</strong>
              <span>
                Pega esta frase en el campo de comentarios de la reserva, o mándala por
                WhatsApp cuando termines.
              </span>
              <div className="recado-acciones">
                <button className="boton" type="button" onClick={copiar}>
                  {copiado ? 'Copiada' : 'Copiar frase'}
                </button>
                <a
                  className="boton"
                  href={`https://wa.me/${LOCAL.whatsapp}?text=${encodeURIComponent(
                    `Hola, acabo de reservar una clase de pociones. ${frase}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => medir('pociones_enviadas', { canal: 'whatsapp' })}
                >
                  Enviar por WhatsApp
                </a>
              </div>
            </div>
          )}

          {elegido.aviso && <p className="reserva-aviso">{elegido.aviso}</p>}

          {/* key: al cambiar de módulo se monta un iframe nuevo, no se navega el viejo */}
          <div className="modulo" key={elegido.via}>
            <iframe
              src={LOCAL[elegido.via]}
              title={elegido.via === 'tienda' ? 'Comprar tarjeta regalo' : 'Reservar en El Caldero Mágico'}
              loading="lazy"
              allow="payment"
            />
          </div>

          <p className="nota">
            {elegido.via === 'tienda' ? 'Pago seguro' : 'Reserva en tiempo real'} con el sistema
            del local. ¿Se ve pequeño?{' '}
            <a href={LOCAL[elegido.via]} target="_blank" rel="noreferrer">
              Ábrelo en una pestaña
            </a>{' '}
            o llama al <a href={LOCAL.telefonoEnlace}>{LOCAL.telefono}</a>.
          </p>
        </>
      )}
    </div>
  );
}
