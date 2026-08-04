import { frame, subscribe, SECTIONS } from "./store";

/**
 * The sound of the shaft.
 *
 * The brief was atmosphere, not a soundtrack, and the previous version missed
 * it in a specific way worth writing down: every layer was noise. Filtered
 * noise, distorted noise, high-passed noise. Noise has no pitch, so nothing
 * ever resolved, and the result read as tape hiss with a rumble under it
 * rather than as a place.
 *
 * Three things fix that, and they are the whole design:
 *
 *   A pitch centre. A bare fifth on D, held under everything. No third, so it
 *   commits to neither major nor minor and never sounds like a chord
 *   progression that forgot to progress. It is what gives the noise something
 *   to be noise *against*.
 *
 *   A room. Every layer is sent through a convolver loaded with an impulse
 *   response generated at runtime: smoothed noise under an exponential decay,
 *   which is a stone chamber. Dry synthesis on a page about a cavern was the
 *   single largest gap between what this looked like and what it sounded like.
 *
 *   Events. A held drone is wallpaper. Discrete sounds are what make a space
 *   feel inhabited, so lava crust ticks and pops at intervals, and crossing
 *   into a chamber strikes an anvil, tuned lower the deeper you are. The
 *   descent becomes audible rather than merely continuous.
 *
 * It also stops running when it is not heard. The old loop held a
 * requestAnimationFrame callback for the life of the page whether or not
 * anything was audible; this suspends the context on mute and on tab blur, so
 * silence costs nothing.
 */

/** Root of the drone. D1, and its fifth and octave. */
const DRONE = [
  { hz: 36.71, gain: 0.5, type: "sine", detune: -4 },
  { hz: 55.0, gain: 0.26, type: "sine", detune: 5 },
  { hz: 73.42, gain: 0.15, type: "triangle", detune: -7 },
];

/** Struck-bar partials. Inharmonic, which is what makes metal sound like metal. */
const ANVIL_PARTIALS = [1, 2.76, 5.4, 8.93];

const MASTER_LEVEL = 0.55;
const FADE = 0.9;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/**
 * A stone chamber as an impulse response.
 *
 * Raw white noise under a decay envelope is the textbook version and it sounds
 * like a tiled bathroom, because real rooms absorb high frequencies far faster
 * than low ones. The one-pole smoothing is what turns it to rock, and the
 * near-silent head gives the ear a pre-delay to read as distance.
 */
function buildCavern(ctx, seconds = 2.8, decay = 2.4) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const ir = ctx.createBuffer(2, length, rate);
  const head = Math.floor(rate * 0.022);

  for (let channel = 0; channel < 2; channel++) {
    const data = ir.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      const white = Math.random() * 2 - 1;
      last = last * 0.72 + white * 0.28;
      const envelope = Math.pow(1 - t, decay);
      const gate = i < head ? i / head : 1;
      data[i] = last * envelope * gate;
    }
  }

  return ir;
}

/** Four seconds of brown noise, shared by every layer that needs texture. */
function buildBrown(ctx) {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  return buffer;
}

class InfernalAudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.muted = true;
    this.raf = 0;
    this.nextCrackle = 0;
    this.unsubscribe = null;
    this.onVisibility = null;
  }

  // ── Graph ───────────────────────────────────────────────────────────────

  init() {
    if (this.ready) return true;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    try {
      const ctx = new AudioCtx();
      this.ctx = ctx;
      const t = ctx.currentTime;

      // Master chain. The compressor is a safety limiter: six layers whose
      // levels are all driven by scroll velocity can and do line up, and
      // without this that lands as a clipped crack in the speaker.
      this.master = ctx.createGain();
      this.master.gain.setValueAtTime(0, t);

      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-9, t);
      limiter.knee.setValueAtTime(6, t);
      limiter.ratio.setValueAtTime(12, t);
      limiter.attack.setValueAtTime(0.004, t);
      limiter.release.setValueAtTime(0.22, t);

      limiter.connect(this.master);
      this.master.connect(ctx.destination);

      // Dry and wet buses. Sub-bass deliberately skips the reverb: convolving
      // a 30 Hz tone smears it into mud and eats headroom for nothing.
      this.dry = ctx.createGain();
      this.dry.connect(limiter);

      const convolver = ctx.createConvolver();
      convolver.buffer = buildCavern(ctx);
      this.wet = ctx.createGain();
      this.wet.gain.setValueAtTime(0.85, t);
      this.wet.connect(convolver);
      convolver.connect(limiter);

      this.brown = buildBrown(ctx);

      this.buildDrone(t);
      this.buildBreath(t);
      this.buildRumble(t);
      this.buildGrit(t);

      this.ready = true;

      // Crossing into a chamber strikes the anvil. Subscribing here rather
      // than from a component keeps the whole engine out of the React tree,
      // which is also why nothing in here ever causes a render.
      this.unsubscribe = subscribe((index) => {
        if (!this.muted) this.strike(index / (SECTIONS.length - 1));
      });

      this.onVisibility = () => {
        if (document.hidden) this.ctx?.suspend();
        else if (!this.muted) this.ctx?.resume();
      };
      document.addEventListener("visibilitychange", this.onVisibility);

      return true;
    } catch (e) {
      console.warn("Web Audio initialisation failed:", e);
      this.ctx = null;
      return false;
    }
  }

  /** The held fifth. Detuned pairs beat against each other so it breathes. */
  buildDrone(t) {
    const ctx = this.ctx;
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.22, t);

    const colour = ctx.createBiquadFilter();
    colour.type = "lowpass";
    colour.frequency.setValueAtTime(220, t);
    colour.Q.setValueAtTime(0.7, t);

    for (const voice of DRONE) {
      const osc = ctx.createOscillator();
      osc.type = voice.type;
      osc.frequency.setValueAtTime(voice.hz, t);
      osc.detune.setValueAtTime(voice.detune, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(voice.gain, t);

      osc.connect(gain);
      gain.connect(colour);
      osc.start();
    }

    colour.connect(this.droneGain);
    this.droneGain.connect(this.dry);
    this.droneGain.connect(this.wet);

    // Slow swell, so the bed is never a flat sustained note.
    const swell = ctx.createOscillator();
    swell.frequency.setValueAtTime(0.055, t);
    const swellDepth = ctx.createGain();
    swellDepth.gain.setValueAtTime(0.07, t);
    swell.connect(swellDepth);
    swellDepth.connect(this.droneGain.gain);
    swell.start();
  }

  /** The furnace itself: brown noise, opening up as the descent deepens. */
  buildBreath(t) {
    const ctx = this.ctx;
    const source = ctx.createBufferSource();
    source.buffer = this.brown;
    source.loop = true;

    this.breathFilter = ctx.createBiquadFilter();
    this.breathFilter.type = "lowpass";
    this.breathFilter.frequency.setValueAtTime(110, t);
    this.breathFilter.Q.setValueAtTime(1.6, t);

    this.breathGain = ctx.createGain();
    this.breathGain.gain.setValueAtTime(0.2, t);

    source.connect(this.breathFilter);
    this.breathFilter.connect(this.breathGain);
    this.breathGain.connect(this.dry);
    this.breathGain.connect(this.wet);
    source.start();

    const drift = ctx.createOscillator();
    drift.frequency.setValueAtTime(0.09, t);
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(22, t);
    drift.connect(depth);
    depth.connect(this.breathFilter.frequency);
    drift.start();
  }

  /** Tectonic sub-bass, answering to scroll velocity. Dry only. */
  buildRumble(t) {
    const ctx = this.ctx;
    this.rumbleGain = ctx.createGain();
    this.rumbleGain.gain.setValueAtTime(0, t);

    const merge = ctx.createGain();
    merge.gain.setValueAtTime(0.5, t);

    this.rumbleOscA = ctx.createOscillator();
    this.rumbleOscA.type = "triangle";
    this.rumbleOscA.frequency.setValueAtTime(28, t);

    this.rumbleOscB = ctx.createOscillator();
    this.rumbleOscB.type = "triangle";
    this.rumbleOscB.frequency.setValueAtTime(34, t);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(90, t);
    lowpass.Q.setValueAtTime(3, t);

    this.rumbleOscA.connect(merge);
    this.rumbleOscB.connect(merge);
    merge.connect(lowpass);
    lowpass.connect(this.rumbleGain);
    this.rumbleGain.connect(this.dry);

    this.rumbleOscA.start();
    this.rumbleOscB.start();
  }

  /** Stone dragging on stone, also velocity-driven. */
  buildGrit(t) {
    const ctx = this.ctx;
    const source = ctx.createBufferSource();
    source.buffer = this.brown;
    source.loop = true;

    this.gritFilter = ctx.createBiquadFilter();
    this.gritFilter.type = "bandpass";
    this.gritFilter.frequency.setValueAtTime(300, t);
    this.gritFilter.Q.setValueAtTime(1.4, t);

    this.gritGain = ctx.createGain();
    this.gritGain.gain.setValueAtTime(0, t);

    source.connect(this.gritFilter);
    this.gritFilter.connect(this.gritGain);
    this.gritGain.connect(this.dry);
    this.gritGain.connect(this.wet);
    source.start();
  }

  // ── Events ──────────────────────────────────────────────────────────────

  /**
   * A single tick of cooling crust. Short enough to be a transient rather than
   * a note; the reverb is what turns it into a sound with a room around it.
   */
  crackle(at, energy) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(900 + Math.random() * 2600, at);

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.setValueAtTime(1800 + Math.random() * 2400, at);
    band.Q.setValueAtTime(6, at);

    const env = ctx.createGain();
    const peak = 0.02 + energy * 0.05;
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(peak, at + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.05 + Math.random() * 0.06);

    osc.connect(band);
    band.connect(env);
    env.connect(this.dry);
    env.connect(this.wet);

    osc.start(at);
    osc.stop(at + 0.2);
  }

  /**
   * The anvil, struck on entering a chamber.
   *
   * `depth` runs 0 at the gates to 1 at the circle, and drops the fundamental
   * roughly an octave across the descent, so the page sounds like it is going
   * somewhere. Partials are inharmonic and each decays at its own rate, with
   * the high ones dying first, which is what a struck bar actually does.
   */
  strike(depth = 0) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx;
    const at = ctx.currentTime + 0.02;
    const root = 196 - clamp(depth, 0, 1) * 92;

    for (const [i, ratio] of ANVIL_PARTIALS.entries()) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(root * ratio, at);

      const env = ctx.createGain();
      const peak = 0.16 / (i + 1.35);
      const life = 2.4 / (i * 0.85 + 1);

      env.gain.setValueAtTime(0.0001, at);
      env.gain.exponentialRampToValueAtTime(peak, at + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, at + life);

      osc.connect(env);
      env.connect(this.dry);
      env.connect(this.wet);
      osc.start(at);
      osc.stop(at + life + 0.1);
    }

    // The hammer itself, as opposed to what it set ringing.
    const hit = ctx.createBufferSource();
    hit.buffer = this.brown;
    hit.loop = false;
    hit.playbackRate.setValueAtTime(2.4, at);

    const shape = ctx.createBiquadFilter();
    shape.type = "bandpass";
    shape.frequency.setValueAtTime(2400, at);
    shape.Q.setValueAtTime(1.1, at);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.13, at);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);

    hit.connect(shape);
    shape.connect(env);
    env.connect(this.dry);
    env.connect(this.wet);
    hit.start(at, Math.random() * 3);
    hit.stop(at + 0.2);
  }

  // ── Transport ───────────────────────────────────────────────────────────

  /** Returns the new audible state, so a caller cannot get out of step. */
  toggle() {
    if (!this.init()) return false;

    this.muted = !this.muted;
    const now = this.ctx.currentTime;

    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(
      this.muted ? 0 : MASTER_LEVEL,
      now + FADE,
    );

    if (this.muted) {
      // Let the fade finish before the context stops, or it cuts off mid-ramp.
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.fadeOut = setTimeout(() => {
        if (this.muted) this.ctx?.suspend();
      }, FADE * 1000 + 120);
    } else {
      clearTimeout(this.fadeOut);
      this.ctx.resume();
      this.nextCrackle = now + 0.4;
      this.startLoop();
      // A struck note on arrival, so turning it on is an event and not just a
      // hiss appearing. Pitched to where the reader currently is.
      this.strike(frame.section / (SECTIONS.length - 1));
    }

    return !this.muted;
  }

  /**
   * Reads the scroll state that the rest of the page already maintains and
   * moves the layers to match. Only alive while something is audible.
   */
  startLoop() {
    if (this.raf) return;

    const update = () => {
      if (this.muted || !this.ready) {
        this.raf = 0;
        return;
      }

      const now = this.ctx.currentTime;
      const depth = frame.scroll;
      const speed = Math.abs(frame.velocity);

      // Deeper is hotter and more open, not just louder.
      this.breathFilter.frequency.setTargetAtTime(110 + depth * 210, now, 0.2);
      this.breathGain.gain.setTargetAtTime(0.2 + depth * 0.14, now, 0.3);
      this.droneGain.gain.setTargetAtTime(0.22 + depth * 0.1, now, 0.4);

      const rumble = Math.min(0.42, speed * 0.06);
      this.rumbleGain.gain.setTargetAtTime(rumble, now, 0.06);
      const hz = 28 + Math.min(18, speed * 2.4);
      this.rumbleOscA.frequency.setTargetAtTime(hz, now, 0.08);
      this.rumbleOscB.frequency.setTargetAtTime(hz * 1.22, now, 0.08);

      this.gritGain.gain.setTargetAtTime(Math.min(0.1, speed * 0.014), now, 0.08);
      this.gritFilter.frequency.setTargetAtTime(
        280 + Math.min(260, speed * 40),
        now,
        0.1,
      );

      // Crust ticks over regardless, and quickens when you are moving through
      // it. Scheduled against the audio clock with a lookahead rather than a
      // timer, so it stays even when the main thread is busy.
      if (now + 0.1 > this.nextCrackle) {
        const energy = Math.min(1, speed * 0.16);
        this.crackle(Math.max(now, this.nextCrackle), energy);
        this.nextCrackle =
          Math.max(now, this.nextCrackle) +
          0.14 +
          Math.random() * (1.5 - energy * 1.15);
      }

      this.raf = requestAnimationFrame(update);
    };

    this.raf = requestAnimationFrame(update);
  }
}

export const infernalAudio = new InfernalAudioEngine();
