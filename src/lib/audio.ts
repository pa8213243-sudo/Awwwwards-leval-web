// Singleton Web Audio API class for premium, non-obtrusive UI audio feedback
// Uses a low-pass filtered oscillator synth engine for luxury editorial feel

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private muted: boolean = false;
  private lastMechanicalClickTime: number = 0;
  private lastMilestoneTime: number = 0;
  private lastScrollClickTime: number = 0;
  private sectionMilestoneMap = new Map<string, { milestone: number; timestamp: number }>();

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('parvej_sound_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Pre-warms and activates the global Web Audio API context singleton upon initial load or user event.
   * Warms up oscillator pipelines with zero-latency buffer allocation.
   */
  public preWarmAudioContext(): void {
    if (typeof window === 'undefined') return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Pre-loads the mechanical click synthesizer pipeline upon initial load.
   */
  public preloadMechanicalAssets(): void {
    if (typeof window === 'undefined') return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Warm up an inactive oscillator path to guarantee 0ms latency on the first scroll milestone
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.001);
    } catch {
      // Audio warmup handled silently
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('parvej_sound_muted', String(this.muted));
    }
    if (!this.muted) {
      this.playNav();
    }
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('parvej_sound_muted', String(this.muted));
    }
  }

  /**
   * Low-pass filtered oscillator synth for tactile button clicks.
   * Creates a warm, smooth click sound free of harsh high frequencies.
   */
  public playButton(freq = 650, duration = 0.02): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      // Low-pass filter for smooth warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.setValueAtTime(1, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + duration);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.005);
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * Navigation click sound with low-pass frequency sweep.
   */
  public playNav(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * Drawer toggle sound - dual-tone chime through low-pass filter.
   */
  public playToggle(isOpen = true): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqStart = isOpen ? 340 : 500;
      const freqEnd = isOpen ? 500 : 340;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * General click sound for UI buttons and cards.
   */
  public playClick(): void {
    this.playButton(700, 0.018);
  }

  /**
   * Faint hover sound for interactive elements.
   */
  /**
   * Editorial low-fidelity mechanical click with tactile micro-transient.
   * Utilizes Web Audio API sample-accurate scheduling to eliminate audio sync lag.
   */
  public playMechanicalClick(frequency = 980, minIntervalMs = 50, scheduledTime?: number): void {
    if (this.muted) return;
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this.lastMechanicalClickTime < minIntervalMs) {
      return; // Debounce rapid scroll frame bursts
    }
    this.lastMechanicalClickTime = nowMs;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Sample-accurate scheduled time (ctx.currentTime as authoritative clock)
      const startTime = scheduledTime !== undefined && scheduledTime >= ctx.currentTime 
        ? scheduledTime 
        : ctx.currentTime + 0.002;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sharp micro-transient bandpass for tactile mechanical snap
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(frequency, startTime);
      filter.Q.setValueAtTime(5.5, startTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, startTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(120, frequency * 0.35), startTime + 0.011);

      // Fast precision envelope to avoid clicks while giving crisp acoustic hit
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.024, startTime + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.014);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.016);
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * Subtle, low-volume tactile mechanical tick specifically synthesized for vertical progress bar major segment thresholds (0, 25, 50, 75, 100%).
   * Uses sample-accurate Web Audio oscillator shaping, high-Q narrow bandpass, and gentle non-intrusive volume.
   */
  public playProgressThresholdTick(segment: number, percentage = 0): void {
    if (this.muted) return;
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this.lastMechanicalClickTime < 65) {
      return; // Debounce rapid bursts
    }
    this.lastMechanicalClickTime = nowMs;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime + 0.001;
      const baseFreq = 1100 + segment * 180; // Gentle frequency scaling per threshold

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, startTime);
      filter.Q.setValueAtTime(6.0, startTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, startTime + 0.009);

      // Low, subtle calibrated volume (~0.014) for soft tactile feedback without acoustic fatigue
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.014, startTime + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.012);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.014);
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * Section milestone debounced trigger handler with sample-accurate Web Audio timing:
   * Fires exactly once per distinct milestone index for each section,
   * completely eliminating duplicate audio ticks and overlapping artifacts during rapid scrolls.
   */
  public triggerSectionMilestone(
    sectionId: string,
    milestoneIndex: number,
    frequency = 850
  ): boolean {
    if (this.muted) return false;

    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const existing = this.sectionMilestoneMap.get(sectionId);

    // If already triggered for this exact milestone within this section, suppress
    if (existing && existing.milestone === milestoneIndex) {
      return false;
    }

    // Global throttle window of 80ms to prevent cacophony on fast inertia scroll across multiple boundaries
    if (nowMs - this.lastMilestoneTime < 80) {
      return false;
    }

    this.sectionMilestoneMap.set(sectionId, {
      milestone: milestoneIndex,
      timestamp: nowMs,
    });
    this.lastMilestoneTime = nowMs;

    // Trigger sample-accurate milestone tone
    this.playMilestonePip(frequency, 0);
    return true;
  }

  /**
   * Editorial low-fidelity UI hum (low frequency warm resonant breath)
   */
  public playUiHum(frequency = 110, duration = 0.35): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(3.0, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.9, now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Suppressed
    }
  }

  /**
   * Subtle architectural scroll click for section transitions
   */
  public playScrollClick(minIntervalMs = 80): void {
    if (this.muted) return;
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this.lastScrollClickTime < minIntervalMs) {
      return;
    }
    this.lastScrollClickTime = nowMs;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.018);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.022);
    } catch {
      // Suppressed
    }
  }

  /**
   * Editorial low-fidelity audio cue for scroll milestone and progress ticks
   * Debounced to ensure clean single-hit acoustic pips
   */
  public playMilestonePip(frequency = 520, minIntervalMs = 60): void {
    if (this.muted) return;
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this.lastMilestoneTime < minIntervalMs) {
      return;
    }
    this.lastMilestoneTime = nowMs;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(frequency, now);
      filter.Q.setValueAtTime(4.0, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, now + 0.025);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * Subtle architectural UI snap / clamp sound
   */
  public playClampingSnap(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Suppressed
    }
  }

  public playHover(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.01);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch {
      // Audio errors suppressed
    }
  }

  private videoAudioOsc: OscillatorNode | null = null;
  private videoAudioGain: GainNode | null = null;

  /**
   * Play continuous ambient audio for video sound ON toggle
   */
  public startVideoAudio(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.stopVideoAudio();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now); // A3 note
      // Soft gentle frequency modulation
      osc.frequency.linearRampToValueAtTime(330, now + 1.5);
      osc.frequency.linearRampToValueAtTime(220, now + 3.0);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);

      this.videoAudioOsc = osc;
      this.videoAudioGain = gain;
    } catch {
      // Audio errors suppressed
    }
  }

  /**
   * Stop ambient video audio loop
   */
  public stopVideoAudio(): void {
    if (this.videoAudioGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.videoAudioGain.gain.linearRampToValueAtTime(0.0001, now + 0.2);
        setTimeout(() => {
          if (this.videoAudioOsc) {
            try { this.videoAudioOsc.stop(); } catch {}
            this.videoAudioOsc = null;
          }
          this.videoAudioGain = null;
        }, 220);
      } catch {
        this.videoAudioOsc = null;
        this.videoAudioGain = null;
      }
    }
  }
}

export const audioManager = AudioManager.getInstance();
