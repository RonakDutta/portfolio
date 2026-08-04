import { frame } from "./store";

class InfernalAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.fireGain = null;
    this.quakeGain = null;
    this.rockCrackleGain = null;
    this.quakeOsc = null;
    this.isMuted = true;
    this.isInitialized = false;
    this.rafId = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. BACKGROUND FIRE NOISE ---
      // Create pink noise buffer for roaring flame texture & snaps
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const fireSource = this.ctx.createBufferSource();
      fireSource.buffer = buffer;
      fireSource.loop = true;

      // Bandpass filter for roaring flame body
      const fireFilter = this.ctx.createBiquadFilter();
      fireFilter.type = "bandpass";
      fireFilter.frequency.setValueAtTime(420, this.ctx.currentTime);
      fireFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      this.fireGain = this.ctx.createGain();
      this.fireGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      fireSource.connect(fireFilter);
      fireFilter.connect(this.fireGain);
      this.fireGain.connect(this.masterGain);
      fireSource.start();

      // Flame crackle micro-pops LFO modulation
      const fireLfo = this.ctx.createOscillator();
      fireLfo.frequency.setValueAtTime(4.5, this.ctx.currentTime);
      const fireLfoGain = this.ctx.createGain();
      fireLfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
      fireLfo.connect(fireLfoGain);
      fireLfoGain.connect(fireFilter.frequency);
      fireLfo.start();

      // --- 2. SCROLL EARTHQUAKE RUMBLE (SUB-BASS SEISMIC THUNDERING) ---
      this.quakeOsc = this.ctx.createOscillator();
      this.quakeOsc.type = "triangle";
      this.quakeOsc.frequency.setValueAtTime(38, this.ctx.currentTime);

      const quakeFilter = this.ctx.createBiquadFilter();
      quakeFilter.type = "lowpass";
      quakeFilter.frequency.setValueAtTime(75, this.ctx.currentTime);

      this.quakeGain = this.ctx.createGain();
      this.quakeGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.quakeOsc.connect(quakeFilter);
      quakeFilter.connect(this.quakeGain);
      this.quakeGain.connect(this.masterGain);
      this.quakeOsc.start();

      // --- 3. SCROLL ROCK CRACKLING / STONE FRACTURE ---
      const rockFilter = this.ctx.createBiquadFilter();
      rockFilter.type = "bandpass";
      rockFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
      rockFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const rockSource = this.ctx.createBufferSource();
      rockSource.buffer = buffer;
      rockSource.loop = true;

      this.rockCrackleGain = this.ctx.createGain();
      this.rockCrackleGain.gain.setValueAtTime(0, this.ctx.currentTime);

      rockSource.connect(rockFilter);
      rockFilter.connect(this.rockCrackleGain);
      this.rockCrackleGain.connect(this.masterGain);
      rockSource.start();

      this.isInitialized = true;
      this.startLoop();
    } catch (e) {
      console.warn("Web Audio initialization failed:", e);
    }
  }

  toggle() {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const now = this.ctx ? this.ctx.currentTime : 0;

    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.85, now + 0.4);
    }

    return !this.isMuted;
  }

  startLoop() {
    const update = () => {
      if (this.isInitialized && !this.isMuted && this.ctx) {
        const now = this.ctx.currentTime;
        const v = Math.abs(frame.velocity);

        // Seismic Earthquake sub-bass rumble scales with scroll speed
        const quakeVol = Math.min(0.55, v * 0.08);
        const quakeFreq = 34 + Math.min(30, v * 3.5);
        this.quakeGain.gain.setTargetAtTime(quakeVol, now, 0.06);
        this.quakeOsc.frequency.setTargetAtTime(quakeFreq, now, 0.06);

        // Rock grinding & stone crackle scales with scroll speed
        const rockVol = Math.min(0.40, v * 0.06);
        this.rockCrackleGain.gain.setTargetAtTime(rockVol, now, 0.05);
      }
      this.rafId = requestAnimationFrame(update);
    };
    update();
  }
}

export const infernalAudio = new InfernalAudioEngine();
