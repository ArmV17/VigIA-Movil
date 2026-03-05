import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonSearchbar, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, 
  helpCircle, 
  map, 
  calendar, 
  documentText, 
  ellipsisHorizontal 
} from 'ionicons/icons';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonSearchbar, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon
  ]
})
export class PreguntasPage implements OnInit {

  textoBusqueda: string = '';

  // Base de datos de preguntas
  preguntas = [
    { pregunta: '¿Cuáles son los costos?', respuesta: 'Los costos varían según la carrera. Consulta en ventanilla.' },
    { pregunta: '¿Qué áreas corresponden a servicios académicos?', respuesta: 'Edificio A, planta baja.' },
    { pregunta: '¿Requisitos de incorporación?', respuesta: 'Acta de nacimiento, certificado de bachillerato y CURP.' },
    { pregunta: '¿Cómo se solicita una Constancia/Kardex?', respuesta: 'A través del portal de alumnos en la sección de trámites.' },
    { pregunta: '¿Cuánto dura el plan de estudios?', respuesta: 'Depende del modelo (TSU o Ingeniería), generalmente de 2 a 4 años.' },
    { pregunta: '¿Se usa uniforme en la universidad?', respuesta: 'El uso de uniforme depende de tu facultad y día de la semana.' }
  ];

  constructor() {
    addIcons({ 
      home, 
      'help-circle': helpCircle, 
      map, 
      calendar, 
      'document-text': documentText, 
      'ellipsis-horizontal': ellipsisHorizontal 
    });
  }

  ngOnInit() {
  }

  get preguntasFiltradas() {
    if (!this.textoBusqueda.trim()) {
      return this.preguntas;
    }
    return this.preguntas.filter(p =>
      p.pregunta.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

}