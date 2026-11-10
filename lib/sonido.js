// Ambiente sonoro generado en el navegador: ni un solo archivo de audio.
// Un zumbido grave de sala, el borboteo del caldero y algún chisporroteo.
// Arranca siempre apagado: el sonido automático espanta más de lo que suma.

let contexto = null;
let maestro = null;
let temporizador = null;
let fuentes = [];

function ruidoMarron(ctx, segundos = 3) {
  const muestras = ctx.sampleRate * segundos;
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < muestras; i += 1) {
    const blanco = Math.random() * 2 - 1;
    ultimo = (ultimo + 0.02 * blanco) / 1.02;
    datos[i] = ultimo * 3.2;
  }
  return buffer;
}

// Una burbuja es un tono corto que sube de golpe y se apaga.
function burbuja(ctx, destino, cuando) {
  const osc = ctx.createOscillator();
  const ganancia = ctx.createGain();
  const base = 160 + Math.random() * 420;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(base, cuando);
  osc.frequency.exponentialRampToValueAtTime(base * 2.4, cuando + 0.09);

  ganancia.gain.setValueAtTime(0.0001, cuando);
  ganancia.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.05, cuando + 0.012);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, cuando + 0.13);

  osc.connect(ganancia).connect(destino);
  osc.start(cuando);
  osc.stop(cuando + 0.16);
}

export function estaSonando() {
  return Boolean(contexto && contexto.state === 'running');
}

export async function encender() {
  if (typeof window === 'undefined') return false;

  if (!contexto) {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return false;
    contexto = new Contexto();

    maestro = contexto.createGain();
    maestro.gain.value = 0;
    maestro.connect(contexto.destination);

    // zumbido de sala: ruido grave, muy filtrado
    const sala = contexto.createBufferSource();
    sala.buffer = ruidoMarron(contexto);
    sala.loop = true;
    const filtro = contexto.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 220;
    const nivelSala = contexto.createGain();
    nivelSala.gain.value = 0.5;
    sala.connect(filtro).connect(nivelSala).connect(maestro);
    sala.start();
    fuentes.push(sala);

    // el caldero: burbujas a destiempo, que es como suena de verdad
    const burbujas = contexto.createGain();
    burbujas.gain.value = 0.9;
    burbujas.connect(maestro);

    const programar = () => {
      if (!contexto) return;
      burbuja(contexto, burbujas, contexto.currentTime + 0.02);
      temporizador = setTimeout(programar, 220 + Math.random() * 900);
    };
    programar();
  }

  await contexto.resume();
  maestro.gain.cancelScheduledValues(contexto.currentTime);
  maestro.gain.setValueAtTime(maestro.gain.value, contexto.currentTime);
  maestro.gain.linearRampToValueAtTime(0.34, contexto.currentTime + 1.2);
  return true;
}

export async function apagar() {
  if (!contexto || !maestro) return;
  maestro.gain.cancelScheduledValues(contexto.currentTime);
  maestro.gain.setValueAtTime(maestro.gain.value, contexto.currentTime);
  maestro.gain.linearRampToValueAtTime(0.0001, contexto.currentTime + 0.5);
  setTimeout(() => contexto && contexto.suspend(), 600);
}

export function soltar() {
  if (temporizador) clearTimeout(temporizador);
  temporizador = null;
  fuentes.forEach((f) => {
    try {
      f.stop();
    } catch {
      /* ya parada */
    }
  });
  fuentes = [];
  if (contexto) contexto.close();
  contexto = null;
  maestro = null;
}
