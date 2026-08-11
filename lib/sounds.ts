"use client";

type SoundType = "click" | "correct" | "wrong" | "unlock" | "complete" | "fanfare";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function tone(freq: number, duration: number, delay = 0, type: OscillatorType = "sine", gainValue = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

const SOUND_KEY = "kinetic-academy-sound";

export function isSoundOn(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(SOUND_KEY) !== "off";
}

export function toggleSound(): boolean {
  const nowOn = !isSoundOn();
  window.localStorage.setItem(SOUND_KEY, nowOn ? "on" : "off");
  return nowOn;
}

export function playSound(type: SoundType) {
  if (!isSoundOn()) return;
  switch (type) {
    case "click":
      tone(600, 0.05, 0, "square", 0.04);
      break;
    case "correct":
      tone(660, 0.1, 0);
      tone(880, 0.15, 0.1);
      break;
    case "wrong":
      tone(220, 0.22, 0, "sawtooth", 0.07);
      break;
    case "unlock":
      tone(523.25, 0.1, 0);
      tone(659.25, 0.1, 0.1);
      tone(783.99, 0.15, 0.2);
      break;
    case "complete":
      tone(523.25, 0.12, 0);
      tone(659.25, 0.12, 0.12);
      tone(783.99, 0.12, 0.24);
      tone(1046.5, 0.22, 0.36);
      break;
    case "fanfare":
      tone(523.25, 0.15, 0);
      tone(659.25, 0.15, 0.15);
      tone(783.99, 0.15, 0.3);
      tone(1046.5, 0.3, 0.45);
      tone(1318.51, 0.35, 0.6);
      break;
  }
}
