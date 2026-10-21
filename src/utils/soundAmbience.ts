/**
 * Web Audio API procedural coffee shop sound generator.
 * Produces:
 * 1. Warm vinyl crackle & dust pops
 * 2. Gentle room murmurs (filtered soft pink noise)
 * 3. Occasional soft harmonic ceramic cup bell resonance
 * Zero external MP3 files, fully client-side and responsive to mute/unmute.
 */
class CoffeeSoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private chimeTimer: number | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();

  private getOrCreateContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  public subscribe(callback: (playing: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  /**
   * Starts ambient coffee shop audio with smooth fade-in
   */
  public async start(): Promise<boolean> {
    try {
      const ctx = this.getOrCreateContext();

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (this.isPlaying && this.masterGain) {
        // Unmute if muted
        this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);
        this.notify();
        return true;
      }

      // Master Gain for smooth volume control & fading
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.5);
      this.masterGain.connect(ctx.destination);

      // Layer 1: Warm ambient cafe room murmur (dual filtered pink noise)
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.075;
        b2 = 0.969 * b2 + white * 0.153;
        let pink = b0 + b1 + b2 + white * 0.53;

        // Random subtle vinyl dust clicks
        if (Math.random() < 0.0008) {
          pink += (Math.random() - 0.5) * 3.5;
        }
        output[i] = pink * 0.12;
      }

      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      // Warm lowpass filter (warm cafe acoustic profile)
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(420, ctx.currentTime);

      // Subtle notch filter for cozy acoustic resonance
      const notch = ctx.createBiquadFilter();
      notch.type = 'peaking';
      notch.frequency.setValueAtTime(180, ctx.currentTime);
      notch.gain.setValueAtTime(3.5, ctx.currentTime);

      this.noiseSource.connect(lowpass);
      lowpass.connect(notch);
      notch.connect(this.masterGain);

      this.noiseSource.start(0);
      this.isPlaying = true;
      this.notify();

      // Layer 2: Occasional gentle harmonic cup / barista chime
      this.scheduleOccasionalChime();

      return true;
    } catch {
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  /**
   * Generates a mellow, harmonic ceramic / espresso cup chime at random relaxing intervals
   */
  private scheduleOccasionalChime() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const delay = 7000 + Math.random() * 12000; // Every 7 - 19 seconds
    this.chimeTimer = window.setTimeout(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      try {
        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        chimeGain.gain.linearRampToValueAtTime(0.012, this.ctx.currentTime + 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.4);

        // Mellow pentatonic harmonic frequencies (E5, G#5, B5, E6)
        const freqs = [659.25, 830.61, 987.77, 1318.51];
        const freq = freqs[Math.floor(Math.random() * freqs.length)];

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        osc.connect(chimeGain);
        chimeGain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.5);
      } catch {
        // Ignore chime error
      }

      this.scheduleOccasionalChime();
    }, delay);
  }

  /**
   * Smoothly fades out and pauses audio
   */
  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

      setTimeout(() => {
        this.isPlaying = false;
        this.notify();
      }, 650);
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Short, organic high-fidelity click sound (tactile espresso/wood tap)
   */
  public playClickSound() {
    try {
      const ctx = this.getOrCreateContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.065, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.055);
    } catch {
      // Audio safeguard
    }
  }

  /**
   * Delicate, subtle hover harmonic sound (soft micro-ping)
   */
  public playHoverSound() {
    try {
      const ctx = this.getOrCreateContext();
      if (ctx.state === 'suspended') {
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 harmonic

      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.075);
    } catch {
      // Audio safeguard
    }
  }

  /**
   * Harmonious celebration chime for completed orders and awards
   */
  public playCelebrationSound() {
    try {
      const ctx = this.getOrCreateContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.55);
      });
    } catch {
      // Audio safeguard
    }
  }
}

export const coffeeSoundManager = new CoffeeSoundManager();

