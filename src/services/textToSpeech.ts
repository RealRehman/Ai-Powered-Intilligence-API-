export class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  }) {
    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    // Try to find the requested voice or use default
    if (options?.voice) {
      const voice = this.voices.find(v => v.name === options.voice);
      if (voice) {
        utterance.voice = voice;
      }
    } else {
      // Try to find a good English voice
      const englishVoice = this.voices.find(v => 
        v.lang.startsWith('en') && v.name.includes('Google')
      ) || this.voices.find(v => v.lang.startsWith('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);

    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      utterance.onerror = (error) => {
        this.currentUtterance = null;
        reject(error);
      };
    });
  }

  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  get isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  get isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  get isPaused(): boolean {
    return this.synthesis.paused;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export const textToSpeechService = new TextToSpeechService();