import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { arrayBufferToBase64, decodeAudioData, float32ToInt16 } from "./audioUtils";

interface LiveClientCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onAudioData?: (audioBuffer: AudioBuffer) => void;
  onError?: (error: any) => void;
  onTranscription?: (text: string, type: 'user' | 'model') => void;
}

export class LiveClient {
  private ai: GoogleGenAI;
  private session: any = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private callbacks: LiveClientCallbacks;
  private isConnected: boolean = false;

  constructor(callbacks: LiveClientCallbacks) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.callbacks = callbacks;
  }

  async connect() {
    if (this.isConnected) return;

    // Create AudioContexts immediately to capture user gesture
    // REMOVED { sampleRate: 24000 } to prevent "NotSupportedError" on hardware that doesn't support it.
    // The browser will use the native sample rate (usually 44.1k or 48k).
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `Você é o sistema de segurança SAVEPLACE. 
          Sua função é alertar os pais calmamente mas com firmeza quando o filho sai da zona segura.
          Seja objetivo. Dê conselhos de segurança imediatos. Pergunte se devem chamar a polícia ou se dirigir ao local.
          Fale português do Brasil de forma clara e assertiva.`,
        },
        callbacks: {
          onopen: () => {
            this.isConnected = true;
            this.callbacks.onOpen?.();
            this.startAudioInput(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && this.outputAudioContext) {
                try {
                    const audioData = new Uint8Array(
                      atob(base64Audio).split('').map(c => c.charCodeAt(0))
                    );
                    // We pass 24000 as the source rate of the audio from Gemini
                    const buffer = await decodeAudioData(audioData, this.outputAudioContext, 24000);
                    this.callbacks.onAudioData?.(buffer);
                } catch (e) {
                    console.error("Audio Decode Error", e);
                }
             }
          },
          onclose: () => {
            this.isConnected = false;
            this.callbacks.onClose?.();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            this.callbacks.onError?.(err);
          }
        }
      });
      
      this.session = sessionPromise;

    } catch (error) {
      console.error("Connection failed", error);
      this.callbacks.onError?.(error);
      this.disconnect();
    }
  }

  private startAudioInput(sessionPromise: Promise<any>) {
    if (!this.inputAudioContext || !this.stream) return;

    this.source = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Resample to 16000Hz if necessary
      const targetRate = 16000;
      const currentRate = this.inputAudioContext!.sampleRate;
      let pcmInt16: Int16Array;

      if (currentRate !== targetRate) {
          pcmInt16 = this.downsampleBuffer(inputData, currentRate, targetRate);
      } else {
          pcmInt16 = float32ToInt16(inputData);
      }

      const base64Data = arrayBufferToBase64(pcmInt16.buffer);
      
      sessionPromise.then(session => {
        session.sendRealtimeInput({
          media: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Data
          }
        });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  // Simple downsampler
  private downsampleBuffer(buffer: Float32Array, sampleRate: number, outSampleRate: number): Int16Array {
      if (outSampleRate === sampleRate) {
          return float32ToInt16(buffer);
      }
      if (outSampleRate > sampleRate) {
          // Upsampling not implemented for this demo, returning raw
          return float32ToInt16(buffer);
      }
      const sampleRateRatio = sampleRate / outSampleRate;
      const newLength = Math.round(buffer.length / sampleRateRatio);
      const result = new Int16Array(newLength);
      let offsetResult = 0;
      let offsetBuffer = 0;
      
      while (offsetResult < result.length) {
          const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
          let accum = 0, count = 0;
          for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
              accum += buffer[i];
              count++;
          }
          const s = Math.max(-1, Math.min(1, accum / count));
          result[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          offsetResult++;
          offsetBuffer = nextOffsetBuffer;
      }
      return result;
  }

  async disconnect() {
    if (this.session) {
       try {
         // Try to close session if method exists
         const s = await this.session;
         if (s && typeof s.close === 'function') {
             s.close();
         }
       } catch (e) {
           console.log("Session close error", e);
       }
    }
    
    this.source?.disconnect();
    this.processor?.disconnect();
    this.stream?.getTracks().forEach(track => track.stop());
    
    if (this.inputAudioContext?.state !== 'closed') await this.inputAudioContext?.close();
    if (this.outputAudioContext?.state !== 'closed') await this.outputAudioContext?.close();
    
    this.isConnected = false;
    this.callbacks.onClose?.();
  }
}