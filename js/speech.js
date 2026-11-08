// Web Speech API & Web Audio Sound Engine for AAC System

class SpeechEngine {
  constructor() {
    this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.speechListeners = [];
    this.defaultRate = 0.95;
    this.defaultPitch = 1.0;
    this.soundClicksEnabled = true;

    // Web Audio Context for tactile chimes & fallback tones
    this.audioCtx = null;

    if (this.synth) {
      this.initVoices();
      if (typeof this.synth.onvoiceschanged !== 'undefined') {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prioritize English high-quality natural voices
    const preferred = this.voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira'))
    ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];

    if (!this.selectedVoice && preferred) {
      this.selectedVoice = preferred;
    }
  }

  getVoices() {
    if (this.voices.length === 0 && this.synth) {
      this.initVoices();
    }
    return this.voices;
  }

  setVoiceByName(name) {
    const v = this.voices.find(voice => voice.name === name);
    if (v) this.selectedVoice = v;
  }

  onSpeechStateChange(callback) {
    this.speechListeners.push(callback);
    return () => {
      this.speechListeners = this.speechListeners.filter(cb => cb !== callback);
    };
  }

  notifyState(isSpeaking, text = '') {
    this.isSpeaking = isSpeaking;
    this.speechListeners.forEach(cb => cb(isSpeaking, text));
  }

  speak(text, options = {}) {
    if (!text || !text.trim()) return;

    const cleanText = text.trim();

    // Visual & State notify
    this.notifyState(true, cleanText);

    // Play subtle tactile feedback beep if enabled
    if (this.soundClicksEnabled) {
      if (options.isEmergency) {
        this.playEmergencyAlertTone();
      } else {
        this.playTactileBeep();
      }
    }

    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this browser. Playing audible chime.');
      setTimeout(() => this.notifyState(false, cleanText), 1200);
      return;
    }

    try {
      this.synth.cancel(); // Cancel any lingering utterances

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = options.lang || 'en-US';
      utterance.lang = targetLang;

      // Match voice by language (Tamil, Telugu, Kannada, Hindi, English)
      const langPrefix = targetLang.split('-')[0].toLowerCase();
      const langVoice = this.voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
      if (langVoice) {
        utterance.voice = langVoice;
      } else if (this.selectedVoice && this.selectedVoice.lang.toLowerCase().startsWith(langPrefix)) {
        utterance.voice = this.selectedVoice;
      }

      utterance.rate = options.rate !== undefined ? options.rate : this.defaultRate;
      utterance.pitch = options.pitch !== undefined ? options.pitch : (options.ageGroup === 'Children' ? Math.max(1.15, this.defaultPitch) : this.defaultPitch);
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      utterance.onstart = () => {
        this.notifyState(true, cleanText);
      };

      utterance.onend = () => {
        this.notifyState(false, cleanText);
      };

      utterance.onerror = (e) => {
        console.warn('Speech error or interrupted:', e);
        this.notifyState(false, cleanText);
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis execution failed:', err);
      this.notifyState(false, cleanText);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.notifyState(false, '');
  }

  // Audio tone generation for tactile AAC feedback
  playTactileBeep() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // AudioContext might be blocked until user gesture
    }
  }

  playEmergencyAlertTone() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174, now + 0.1);
      osc.frequency.setValueAtTime(880, now + 0.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playSyncSuccessTone() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = now + idx * 0.09;
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch (e) {}
  }
}

export const speechEngine = new SpeechEngine();
