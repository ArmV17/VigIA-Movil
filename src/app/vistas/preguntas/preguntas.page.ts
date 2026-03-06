import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonContent, 
  IonSearchbar, 
  IonList, 
  IonItem, 
  IonIcon,
  IonLabel 
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
    RouterLinkActive,
    IonContent, 
    IonSearchbar, 
    IonList, 
    IonItem, 
    IonIcon,
    IonLabel
  ],
})
export class PreguntasPage implements OnInit {

  textoBusqueda: string = '';

  preguntas = [
    { pregunta: '¿Cuáles son los costos?' },
    { pregunta: '¿Qué áreas corresponden a servicios académicos?' },
    { pregunta: '¿Requisitos de incorporación?' },
    { pregunta: '¿Cómo se solicita una Constancia/Kardex?' },
    { pregunta: '¿Cuánto dura el plan de estudios?' },
    { pregunta: '¿Se usa uniforme en la universidad?' }
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

  ngOnInit() {}

  get preguntasFiltradas() {
    return this.preguntas.filter(p =>
      p.pregunta.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }
}