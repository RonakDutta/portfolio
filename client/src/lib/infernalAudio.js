import { frame } from "./store";

class InfernalAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.filterNode = null;

    // Volcanic scroll layers
    this.rumbleGain = null;
    this.rumbleOsc1 = null;
    this.rumbleOsc2 = null;
    this.grindGain = null;
    this.grindFilter = null;
    this.crackGain = null;

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

      // ═══════════════════════════════════════════════════════
      // 1. AMBIENT FURNACE HUM (original — untouched)
      // ═══════════════════════════════════════════════════════
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(95, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

      noiseSource.connect(this.filterNode);
      this.filterNode.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(25, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      lfo.start();
      noiseSource.start();

      // ═══════════════════════════════════════════════════════
      // 2. VOLCANIC SCROLL — LAYER A: Seismic Sub-Bass Rumble
      //    Two detuned triangle oscillators for thick tectonic
      //    plate movement feel, through a waveshaper for grit.
      // ═══════════════════════════════════════════════════════
      this.rumbleOsc1 = this.ctx.createOscillator();
      this.rumbleOsc1.type = "triangle";
      this.rumbleOsc1.frequency.setValueAtTime(28, this.ctx.currentTime);

      this.rumbleOsc2 = this.ctx.createOscillator();
      this.rumbleOsc2.type = "triangle";
      this.rumbleOsc2.frequency.setValueAtTime(34, this.ctx.currentTime);

      // Waveshaper for sub-harmonic distortion (the "tearing earth" edge)
      const shaper = this.ctx.createWaveShaper();
      const curveLen = 256;
      const curve = new Float32Array(curveLen);
      for (let i = 0; i < curveLen; i++) {
        const x = (i * 2) / curveLen - 1;
        curve[i] = (Math.PI + 3.2) * x / (Math.PI + 3.2 * Math.abs(x));
      }
      shaper.curve = curve;
      shaper.oversample = "2x";

      const rumbleLowpass = this.ctx.createBiquadFilter();
      rumbleLowpass.type = "lowpass";
      rumbleLowpass.frequency.setValueAtTime(80, this.ctx.currentTime);
      rumbleLowpass.Q.setValueAtTime(4, this.ctx.currentTime);

      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.setValueAtTime(0, this.ctx.currentTime);

      const rumbleMerge = this.ctx.createGain();
      rumbleMerge.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.rumbleOsc1.connect(rumbleMerge);
      this.rumbleOsc2.connect(rumbleMerge);
      rumbleMerge.connect(shaper);
      shaper.connect(rumbleLowpass);
      rumbleLowpass.connect(this.rumbleGain);
      this.rumbleGain.connect(this.masterGain);
      this.rumbleOsc1.start();
      this.rumbleOsc2.start();

      // Slow LFO on the rumble frequency for seismic wavering
      const rumbleLfo = this.ctx.createOscillator();
      rumbleLfo.frequency.setValueAtTime(0.3, this.ctx.currentTime);
      const rumbleLfoGain = this.ctx.createGain();
      rumbleLfoGain.gain.setValueAtTime(8, this.ctx.currentTime);
      rumbleLfo.connect(rumbleLfoGain);
      rumbleLfoGain.connect(this.rumbleOsc1.frequency);
      rumbleLfoGain.connect(this.rumbleOsc2.frequency);
      rumbleLfo.start();

      // ═══════════════════════════════════════════════════════
      // 3. VOLCANIC SCROLL — LAYER B: Rock Grinding Mid-Freq
      //    Brown noise through a resonant bandpass for the
      //    grinding/shifting stone texture on top of the bass.
      // ═══════════════════════════════════════════════════════
      const grindSource = this.ctx.createBufferSource();
      grindSource.buffer = buffer;
      grindSource.loop = true;

      this.grindFilter = this.ctx.createBiquadFilter();
      this.grindFilter.type = "bandpass";
      this.grindFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.grindFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      this.grindGain = this.ctx.createGain();
      this.grindGain.gain.setValueAtTime(0, this.ctx.currentTime);

      grindSource.connect(this.grindFilter);
      this.grindFilter.connect(this.grindGain);
      this.grindGain.connect(this.masterGain);
      grindSource.start();

      // ═══════════════════════════════════════════════════════
      // 4. VOLCANIC SCROLL — LAYER C: Surface Crackle/Pops
      //    High-passed noise for the snap-crackle of cooling
      //    lava crust breaking apart as you move through it.
      // ═══════════════════════════════════════════════════════
      const crackSource = this.ctx.createBufferSource();
      crackSource.buffer = buffer;
      crackSource.loop = true;

      const crackFilter = this.ctx.createBiquadFilter();
      crackFilter.type = "highpass";
      crackFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
      crackFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.crackGain = this.ctx.createGain();
      this.crackGain.gain.setValueAtTime(0, this.ctx.currentTime);

      crackSource.connect(crackFilter);
      crackFilter.connect(this.crackGain);
      this.crackGain.connect(this.masterGain);
      crackSource.start();

      this.isInitialized = true;
      this.startLoop();
    } catch (e) {
      console.warn("Web Audio initialization failed:", e);
    }
  }

  toggle() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();

    this.isMuted = !this.isMuted;
    const now = this.ctx ? this.ctx.currentTime : 0;

    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : 0.85,
        now + 0.4,
      );
    }

    return !this.isMuted;
  }

  startLoop() {
    const update = () => {
      if (this.isInitialized && !this.isMuted && this.ctx) {
        const now = this.ctx.currentTime;
        const s = frame.scroll;
        const v = Math.abs(frame.velocity);

        // Original ambient depth modulation
        const targetFreq = 95 + s * 140;
        this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.15);

        // ── Volcanic scroll intensity (velocity-driven) ──

        // Layer A: Seismic sub-bass (28-50Hz tectonic rumble)
        const rumbleVol = Math.min(0.6, v * 0.09);
        const rumbleFreq = 28 + Math.min(22, v * 3);
        this.rumbleGain.gain.setTargetAtTime(rumbleVol, now, 0.05);
        this.rumbleOsc1.frequency.setTargetAtTime(rumbleFreq, now, 0.06);
        this.rumbleOsc2.frequency.setTargetAtTime(rumbleFreq * 1.22, now, 0.06);

        // Layer B: Rock grinding mid-texture
        const grindVol = Math.min(0.18, v * 0.025);
        const grindFreq = 280 + Math.min(300, v * 50);
        this.grindGain.gain.setTargetAtTime(grindVol, now, 0.06);
        this.grindFilter.frequency.setTargetAtTime(grindFreq, now, 0.08);

        // Layer C: Lava crust crackle pops
        const crackVol = Math.min(0.08, v * 0.012);
        this.crackGain.gain.setTargetAtTime(crackVol, now, 0.04);
      }
      this.rafId = requestAnimationFrame(update);
    };
    update();
  }
}

export const infernalAudio = new InfernalAudioEngine();
