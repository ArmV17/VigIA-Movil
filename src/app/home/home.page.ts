import { Component } from '@angular/core';
import { IonContent, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons'; 
import { home, helpCircle, map, calendar, documentText, ellipsisHorizontal } from 'ionicons/icons'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonLabel, CommonModule], 
})
export class HomePage {
  segmentoActivo: string = 'inicio';

  constructor() {
    addIcons({ home, 'help-circle': helpCircle, map, calendar, 'document-text': documentText, 'ellipsis-horizontal': ellipsisHorizontal });
  }

  seleccionar(tab: string) {
    this.segmentoActivo = tab;
  }
}