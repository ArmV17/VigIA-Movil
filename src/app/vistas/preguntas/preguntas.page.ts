import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonContent, IonSearchbar, IonIcon, IonLabel, IonSegment, 
  IonSegmentButton, IonAccordion, IonAccordionGroup, IonItem, 
  IonButton, IonTextarea, IonInput 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, helpCircle, map, calendar, documentText, ellipsisHorizontal,
  clipboardOutline, helpCircleOutline, arrowForwardOutline, 
  documentTextOutline, paperPlane, searchOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, RouterLinkActive,
    IonContent, IonSearchbar, IonIcon, IonLabel, IonSegment, 
    IonSegmentButton, IonAccordion, IonAccordionGroup, IonItem, 
    IonButton, IonTextarea, IonInput
  ]
})
export class PreguntasPage {
  segmentoActual: string = 'frecuentes';
  textoBusqueda: string = '';

  // Modelo para el envío de preguntas
  nuevaPregunta = {
    nombre: '',
    pregunta: '',
    detalles: ''
  };

  // Datos simulando quest_all de Django
  preguntas = [
      {
      id: '1', 
      titulo: '¿Cuáles son los costos?', 
      informacion: 'Los costos de inscripción varían según el promedio...', 
      imagen: null,
      documento: null,
      redirigir: null
    },
    { 
      id: '2', 
      titulo: '¿Uso de uniforme?', 
      informacion: 'Es obligatorio el uso de uniforme de gala los días lunes.',
      imagen: null,
      documento: null,
      redirigir: null
    }
  ];

  constructor() {
    addIcons({ 
      home, 'help-circle': helpCircle, map, calendar, 
      'document-text': documentText, 'ellipsis-horizontal': ellipsisHorizontal,
      'clipboard-outline': clipboardOutline,
      'help-circle-outline': helpCircleOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'document-text-outline': documentTextOutline,
      'paper-plane': paperPlane,
      'search-outline': searchOutline
    });
  }

  get preguntasFiltradas() {
    return this.preguntas.filter(q => 
      q.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  abrirEnlace(url: string) {
    window.open(url, '_blank');
  }

  enviarPregunta() {
    if(this.nuevaPregunta.pregunta.length < 10) {
      console.log("Pregunta demasiado corta");
      return;
    }
    console.log('Enviando a Django:', this.nuevaPregunta);
    // Aquí conectarías con tu API
  }
}