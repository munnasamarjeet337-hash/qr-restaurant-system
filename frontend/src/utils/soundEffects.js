// Web Audio API Sound Synthesizer for Kitchen KDS & Customer Ordering (zero external audio file dependencies)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Resonant restaurant kitchen bell chime (587Hz D5 -> 880Hz A5 harmonics)
 */
export function playKitchenChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic 1 (Root tone - high bell ping)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Harmonic 2 (Bright high chime overtone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.05); // D6

    gain2.gain.setValueAtTime(0.25, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    // Second bell strike
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(880, now + 0.25); // A5

    gain3.gain.setValueAtTime(0.35, now + 0.25);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc3.connect(gain3);
    gain3.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 1.3);

    osc2.start(now + 0.05);
    osc2.stop(now + 1.4);

    osc3.start(now + 0.25);
    osc3.stop(now + 1.6);
  } catch (err) {
    console.warn('Could not play kitchen chime:', err);
  }
}

/**
 * Ascending pleasant success chime for customer order completion
 */
export function playOrderSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  } catch (err) {
    console.warn('Could not play success sound:', err);
  }
}

/**
 * Soft attention ping for bill request / settlement notifications
 */
export function playBillAlertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  } catch (err) {
    console.warn('Could not play bill alert sound:', err);
  }
}
