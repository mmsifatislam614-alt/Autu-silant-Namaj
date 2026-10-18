/**
 * Web Audio API synthesizer for prayer chime and Azan tone.
 * 100% Offline with zero external asset download.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPrayerChime(isSilenced = false) {
  if (isSilenced) {
    // Phone is in silent mode, do not produce sound
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Gentle three-tone harmonic chime
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.18);

    gain.gain.setValueAtTime(0, now + idx * 0.18);
    gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.18 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.18);
    osc.stop(now + idx * 0.18 + 1.3);
  });
}
