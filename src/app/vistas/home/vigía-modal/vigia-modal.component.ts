import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../servicios/api.service';
import { ModalController } from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, send, micOutline, playCircleOutline, square, pauseCircleOutline } from 'ionicons/icons';
import { environment } from '../../../../environments/environment';

export interface ChatMessage {
  text?: string;
  htmlText?: string;
  sender: 'bot' | 'user';
  imageUrl?: string;
  redirectUrl?: string;
}

@Component({
  selector: 'app-vigia-modal',
  templateUrl: './vigia-modal.component.html',
  styleUrls: ['./vigia-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon
  ]
})
export class VigiaModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  messages: ChatMessage[] = [];
  userMessage: string = '';
  isTyping: boolean = false;

  // Voice capabilities
  isRecording: boolean = false;
  isSpeaking: boolean = false;
  microphoneSpeech: boolean = true;
  lastText: string = '';
  microphoneRecordThisTurn: boolean = false;

  private recognition: any;
  private synth = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScrollToBottom = false;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ close, send, 'mic-outline': micOutline, 'play-circle-outline': playCircleOutline, square, 'pause-circle-outline': pauseCircleOutline });
  }

  ngOnInit() {
  this.initSpeechRecognition();
  this.initSpeechSynthesis();

  const initialText = '¡Hola!! Soy VigIA, tu asistente virtual de la Universidad Tecnológica de Coahuila. Puedes preguntarme sobre trámites, carreras, costos u otros temas de la universidad. ¿En qué puedo ayudarte?';
  
  this.messages.push({
    text: initialText,
    sender: 'bot'
  });

  this.lastText = initialText;
  this.shouldScrollToBottom = true;
}

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // --- HTML Rendering & Backend Integration ---

  sendMessage(fromMic: boolean = false) {
    const trimmed = this.userMessage.trim();
    if (!trimmed) {
      if (this.isRecording) this.stopRecording();
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    }

    // Add user message to UI
    this.messages.push({
      text: trimmed,
      sender: 'user'
    });
    this.userMessage = '';
    this.shouldScrollToBottom = true;
    this.isTyping = true;

    // Remember if this question was asked via microphone
    this.microphoneRecordThisTurn = fromMic;

    // Call Backend
    this.apiService.sendChatMessage(trimmed).subscribe({
      next: (data: any) => {
        this.isTyping = false;
        if (data.success && data.answer) {
          this.displayBotResponse(data.answer);
        } else {
          this.displayErrorResponse(data.message || 'Error desconocido del servidor.');
        }
      },
      error: (err) => {
        this.isTyping = false;
        console.error('Error in chatbot API:', err);
        this.displayErrorResponse('Lo siento, ocurrió un error al conectarme con los servidores de la UTC.');
      }
    });
  }

  private displayBotResponse(answer: any) {
    let rawText = answer.informacion || '';
    this.lastText = rawText;

    // Parse Markdown-like format to HTML
    let htmlContent = rawText
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="chat-link-btn" href="$2" target="_blank"><ion-icon name="map"></ion-icon>$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/📍([^]*?)(\/mapa\/)/g, '<br><a class="chat-link-btn" href="/mapa/" target="_blank"><ion-icon name="map"></ion-icon>📍 Ver en el mapa</a>')
      .replace(/\n/g, '<br>')
      .replace(/(^|<br>)\*\s/g, '$1• ')
      .replace(/(^|<br>)-\s/g, '$1• ');

    const newMsg: ChatMessage = {
      htmlText: htmlContent,
      sender: 'bot'
    };

    if (answer.imagenes) {
      newMsg.imageUrl = answer.imagenes;
    }
    if (answer.redirigir && answer.redirigir.trim() !== '') {
      newMsg.redirectUrl = answer.redirigir;
    }

    this.messages.push(newMsg);
    this.shouldScrollToBottom = true;

    // If asked via microphone, auto-read answer
    if (this.microphoneRecordThisTurn) {
      // Small delay to let UI render before speaking
      setTimeout(() => {
        this.speakText(rawText);
      }, 100);
      this.microphoneRecordThisTurn = false; // reset
    }
  }

  private displayErrorResponse(errMsg: string) {
    this.messages.push({
      text: errMsg,
      sender: 'bot'
    });
    this.shouldScrollToBottom = true;
  }

  onEnterKey(event: Event) {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.sendMessage(false);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  private scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) { }
  }

  // --- Voice Capabilities (Web Speech API) ---

  private initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const { webkitSpeechRecognition }: any = window;
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'es-MX';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.microphoneRecordThisTurn = true;
        this.userMessage = ''; // Clear input for new transcription
        this.cdr.detectChanges();
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          this.userMessage = finalTranscript.trim();
          this.cdr.detectChanges();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('STT Error:', event.error);
        this.stopRecording();
      };

      this.recognition.onend = () => {
        // If it ended naturally and we have text, send it
        if (this.isRecording && this.userMessage.trim().length > 0) {
          this.stopRecording();
          this.sendMessage(true);
        } else {
          this.stopRecording();
        }
      };
    } else {
      this.microphoneSpeech = false;
      console.warn("Navegador no soporta Web Speech API (STT)");
    }
  }

  private initSpeechSynthesis() {
    if (this.synth) {
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      this.loadVoices();

      const autoSpeak = () => {
        if (!this.isSpeaking && this.lastText) {
          this.speakText(this.lastText);
        }
        document.removeEventListener('touchstart', autoSpeak);
      };

      document.addEventListener('touchstart', autoSpeak);
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  toggleMicrophone() {
    if (!this.recognition) {
      alert('Reconocimiento de voz no disponible en este navegador móvil.');
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    } else {
      if (this.isSpeaking) {
        this.synth.cancel();
        this.isSpeaking = false;
      }

      this.userMessage = '';
      
      try {
        this.recognition.abort();
        setTimeout(() => {
          this.recognition.start();
        }, 150);
      } catch (e) {
        this.recognition.start();
      }
    }
  }

  private stopRecording() {
    if (this.recognition && this.isRecording) {
      this.isRecording = false;
      this.recognition.stop();
      this.cdr.detectChanges();
    }
  }

  // Text To Speech logic for reading responses
  toggleTTS() {
    if (!this.synth) return;

    if (this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.cdr.detectChanges();
    } else {
      const textToRead = this.lastText || '¡Hola!! Soy VigIA, tu asistente virtual de la Universidad Tecnológica de Coahuila...';
      this.speakText(textToRead);
    }
  }

  private speakText(text: string) {
    if (!this.synth) return;
    this.synth.cancel(); 

    const cleanText = this.removeEmojis(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.lang = 'es-MX';
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;

    let currentVoices = this.synth.getVoices();
    if (currentVoices.length === 0) {
      this.loadVoices();
      currentVoices = this.voices;
    }

    const esVoices = currentVoices.filter(v => v.lang.includes('es'));
    if (esVoices.length > 0) {
      const preferred = esVoices.find(v => v.name.includes('Google') || v.name.includes('Mexico'));
      utterance.voice = preferred || esVoices[0];
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.cdr.detectChanges();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.cdr.detectChanges();
    };

    this.synth.speak(utterance);
  }

  private removeEmojis(text: string): string {
    return text
      .replace(/[*#()@><]/g, '')
      .replace(/br/g, '')
      .replace(/<br>/g, '')
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ''); // Remove most emojis but keep letters, numbers, punctuation
  }
}
