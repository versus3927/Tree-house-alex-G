/**
 * A tiny, original Web Audio "treehouse" sketch.
 * It is NOT the song – just a soft, wobbly lo-fi loop, some rain,
 * a ladder xylophone and a bell, all synthesised in the browser.
 */

export interface Engine {
  start(): void;
  stop(): void;
  setVolume(v: number): void;
  setRain(on: boolean): void;
  pluck(midi: number): void;
  chime(): void;
  click(): void;
  resume(): void;
  destroy(): void;
}

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Fmaj7 – Em7 – Dm7 – Cmaj7 (a slow, descending drift)
const CHORDS = [
  { notes: [53, 57, 60, 64], bass: 41 },
  { notes: [52, 55, 59, 62], bass: 40 },
  { notes: [50, 53, 57, 60], bass: 38 },
  { notes: [48, 52, 55, 59], bass: 36 },
];
const ARP = [0, 2, 1, 3, 2, 3, 1, 2];
const PENTA = [72, 74, 76, 79, 81, 84];
const BPM = 70;
const STEP = 60 / BPM / 2;

export function createEngine(): Engine {
  const Ctor: typeof AudioContext =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctor();

  /* ---- master ---- */
  const out = ctx.createGain();
  out.gain.value = 0.7;
  out.connect(ctx.destination);

  /* ---- shared echo "space" ---- */
  const space = ctx.createGain();
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = 0.43;
  const fb = ctx.createGain();
  fb.gain.value = 0.38;
  const dlp = ctx.createBiquadFilter();
  dlp.type = "lowpass";
  dlp.frequency.value = 1600;
  space.connect(delay);
  delay.connect(dlp);
  dlp.connect(fb);
  fb.connect(delay);
  dlp.connect(out);

  /* ---- music chain ---- */
  const bus = ctx.createGain();
  const tape = ctx.createBiquadFilter();
  tape.type = "lowpass";
  tape.frequency.value = 2300;
  tape.Q.value = 0.5;
  const musicMaster = ctx.createGain();
  musicMaster.gain.value = 0;
  const musicSend = ctx.createGain();
  musicSend.gain.value = 0.5;
  bus.connect(tape);
  tape.connect(musicMaster);
  musicMaster.connect(out);
  musicMaster.connect(musicSend);
  musicSend.connect(space);

  /* ---- sfx chain ---- */
  const sfx = ctx.createGain();
  sfx.gain.value = 1;
  const sfxSend = ctx.createGain();
  sfxSend.gain.value = 0.45;
  sfx.connect(out);
  sfx.connect(sfxSend);
  sfxSend.connect(space);

  /* ---- tape wobble ---- */
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.38;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 7; // cents
  lfo.connect(lfoGain);
  lfo.start();

  /* ---- noise ---- */
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  {
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  /* ---- rain ---- */
  const rainSrc = ctx.createBufferSource();
  rainSrc.buffer = noiseBuf;
  rainSrc.loop = true;
  const rainHp = ctx.createBiquadFilter();
  rainHp.type = "highpass";
  rainHp.frequency.value = 700;
  const rainLp = ctx.createBiquadFilter();
  rainLp.type = "lowpass";
  rainLp.frequency.value = 6500;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0;
  rainSrc.connect(rainHp);
  rainHp.connect(rainLp);
  rainLp.connect(rainGain);
  rainGain.connect(out);
  rainSrc.start();

  /* ---- helpers ---- */
  function tone(
    type: OscillatorType,
    freq: number,
    t: number,
    dur: number,
    peak: number,
    attack: number,
    dest: AudioNode,
    detune = 0,
    hold = 0,
  ) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    lfoGain.connect(o.detune);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    if (hold > 0) g.gain.setValueAtTime(peak, t + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.onended = () => {
      try {
        lfoGain.disconnect(o.detune);
      } catch {
        /* already gone */
      }
    };
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function pluckAt(freq: number, t: number, vel: number, dest: AudioNode, gain = 1) {
    tone("sine", freq, t, 1.7, 0.12 * vel * gain, 0.006, dest);
    tone("triangle", freq * 2, t, 0.55, 0.03 * vel * gain, 0.004, dest);
    tone("sine", freq * 3.01, t, 0.18, 0.012 * vel * gain, 0.003, dest);
  }

  function noiseHit(t: number, peak: number, dur: number, hp: number, dest: AudioNode) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.02);
  }

  function thump(t: number, peak: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + 0.25);
  }

  /* ---- sequencer ---- */
  let playing = false;
  let timer: number | null = null;
  let step = 0;
  let nextTime = 0;

  function scheduleStep(s: number, time: number) {
    const chord = CHORDS[Math.floor(s / 8)];
    const si = s % 8;
    const swing = si % 2 ? 0.028 : 0;
    const human = (Math.random() - 0.5) * 0.018;
    const t = Math.max(ctx.currentTime, time + swing + human);

    if (si === 0) {
      chord.notes.forEach((n) => {
        [-8, 8].forEach((dt) => tone("triangle", mtof(n), time, 4.6, 0.017, 1.1, bus, dt, 1.6));
      });
      tone("sine", mtof(chord.bass), time, 2.8, 0.22, 0.02, bus);
    }
    if (si === 5 && Math.random() < 0.8) {
      tone("sine", mtof(chord.bass), t, 1.3, 0.13, 0.02, bus);
    }

    if (Math.random() < 0.86) {
      const n = chord.notes[ARP[si]] + (si === 3 || si === 6 ? 12 : 0);
      pluckAt(mtof(n), t, 0.55 + Math.random() * 0.4, bus);
    }

    if ((si === 0 || si === 4) && Math.random() < 0.55) {
      const m = PENTA[Math.floor(Math.random() * PENTA.length)];
      tone("triangle", mtof(m), t + 0.02, 2.2, 0.05, 0.01, bus);
    }

    if (si % 2 === 1 && Math.random() < 0.75) noiseHit(t, 0.016, 0.05, 7000, bus);
    if ((si === 0 || si === 5) && Math.random() < 0.9) thump(t, si === 0 ? 0.16 : 0.1);
  }

  function tick() {
    if (!playing) return;
    if (nextTime < ctx.currentTime - 0.1) nextTime = ctx.currentTime + 0.05;
    while (nextTime < ctx.currentTime + 0.25) {
      scheduleStep(step, nextTime);
      nextTime += STEP;
      step = (step + 1) % 32;
    }
  }

  /* ---- public api ---- */
  return {
    resume() {
      if (ctx.state === "suspended") void ctx.resume();
    },
    start() {
      if (ctx.state === "suspended") void ctx.resume();
      if (playing) return;
      playing = true;
      nextTime = ctx.currentTime + 0.08;
      musicMaster.gain.cancelScheduledValues(ctx.currentTime);
      musicMaster.gain.setTargetAtTime(0.95, ctx.currentTime, 0.5);
      timer = window.setInterval(tick, 70);
      tick();
    },
    stop() {
      playing = false;
      if (timer !== null) window.clearInterval(timer);
      timer = null;
      musicMaster.gain.cancelScheduledValues(ctx.currentTime);
      musicMaster.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    },
    setVolume(v) {
      out.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), ctx.currentTime, 0.05);
    },
    setRain(on) {
      if (ctx.state === "suspended") void ctx.resume();
      rainGain.gain.setTargetAtTime(on ? 0.06 : 0, ctx.currentTime, 0.6);
    },
    pluck(midi) {
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime + 0.005;
      const f = mtof(midi);
      tone("sine", f, t, 1.4, 0.2, 0.004, sfx);
      tone("triangle", f * 2, t, 0.45, 0.05, 0.003, sfx);
      tone("sine", f * 4.02, t, 0.12, 0.025, 0.002, sfx);
    },
    chime() {
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime + 0.005;
      const base = 784;
      const parts: Array<[number, number, number]> = [
        [1, 0.16, 3.0],
        [2.0, 0.09, 2.0],
        [2.76, 0.07, 1.4],
        [5.4, 0.035, 0.7],
      ];
      parts.forEach(([r, a, d]) => tone("sine", base * r, t, d, a, 0.003, sfx));
    },
    click() {
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime + 0.002;
      noiseHit(t, 0.12, 0.03, 1500, sfx);
      tone("sine", 190, t, 0.1, 0.12, 0.002, sfx);
    },
    destroy() {
      this.stop();
      try {
        lfo.stop();
        rainSrc.stop();
      } catch {
        /* noop */
      }
      void ctx.close();
    },
  };
}
