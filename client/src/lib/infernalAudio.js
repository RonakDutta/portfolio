import { frame } from "./store";

class InfernalAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.scrollGain = null;
    this.filterNode = null;
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

      // Lowpass Filter for Furnace Rumble
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(95, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

      // Ambient Noise Generator (Brown Noise buffer)
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

      // Ambient Gain Node
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

      noiseSource.connect(this.filterNode);
      this.filterNode.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      // LFO for breathing furnace pulse
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(25, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      lfo.start();
      noiseSource.start();

      // Scroll Friction Crackle
      this.scrollGain = this.ctx.createGain();
      this.scrollGain.gain.setValueAtTime(0, this.ctx.currentTime);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(1400, this.ctx.currentTime);

      const crackleSource = this.ctx.createBufferSource();
      crackleSource.buffer = buffer;
      crackleSource.loop = true;
      crackleSource.connect(highpass);
      highpass.connect(this.scrollGain);
      this.scrollGain.connect(this.masterGain);
      crackleSource.start();

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
        const s = frame.scroll;
        const v = Math.abs(frame.velocity);

        // Modulate furnace pitch as you descend deeper into Hell
        const targetFreq = 95 + s * 140;
        this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.15);

        // Modulate scroll friction crackle with scroll velocity
        const crackleVol = Math.min(0.22, v * 0.035);
        this.scrollGain.gain.setTargetAtTime(crackleVol, now, 0.08);
      }
      this.rafId = requestAnimationFrame(update);
    };
    update();
  }
}

export const infernalAudio = new InfernalAudioEngine();
