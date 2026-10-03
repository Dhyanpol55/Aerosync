/**
 * Tactical Audio & Voice Alert Utility for AEROSYNC C2 System
 * Native Web Audio API (880Hz radio alert tone) + Native Web Speech API synthesis.
 * Designed to fail gracefully if browser audio permissions or speech synthesis are muted.
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a high-contrast 880Hz tactical radio alert tone (dual-chirp)
 */
export function playTacticalChime(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Dual-tone frequency burst: 880Hz (A5) then 1174Hz (D6) tactical beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.setValueAtTime(1174, now + 0.08);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.24);
  } catch {
    // Graceful fallback for restricted environments
  }
}

/**
 * Synthesize a tactical voice alert using Web Speech API
 */
export function speakTacticalAlert(text: string): void {
  if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any lingering queue

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05; // Slightly faster for military cadence
    utterance.pitch = 0.95; // Crisp command tone
    utterance.volume = 0.9;

    // Attempt to pick a clean English voice if available
    const voices = window.speechSynthesis.getVoices();
    const militaryVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (militaryVoice) {
      utterance.voice = militaryVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Fail gracefully
  }
}

/**
 * Plays 880Hz tactical radio chime, followed immediately by speech announcement
 */
export function playTacticalVoiceAlert(announcement: string): void {
  if (isMuted) return;
  playTacticalChime();

  // Delay speech output slightly so the radio chirp precedes the utterance
  setTimeout(() => {
    speakTacticalAlert(announcement);
  }, 220);
}

export function setTacticalAudioMute(muted: boolean): void {
  isMuted = muted;
  if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export function getTacticalAudioMute(): boolean {
  return isMuted;
}
