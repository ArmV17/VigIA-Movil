import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons'; 
import { home, helpCircle, map, calendar, documentText, ellipsisHorizontal } from 'ionicons/icons'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule],
})
export class HomePage {
  seccionActiva: string = 'inicio';

  constructor(private router: Router) {
    addIcons({ 
      home, 
      'help-circle': helpCircle, 
      map, 
      calendar, 
      'document-text': documentText, 
      'ellipsis-horizontal': ellipsisHorizontal 
    });
  }

  seleccionar(tab: string) {
    this.seccionActiva = tab;
    
    if (tab === 'inicio') {
      this.router.navigate(['/inicio']);
    } else if (tab === 'preguntas') {
      this.router.navigate(['/preguntas']);
    }
  }
}