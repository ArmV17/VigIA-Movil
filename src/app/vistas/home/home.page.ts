import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonContent, IonIcon, IonLabel } from '@ionic/angular/standalone';
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive,
    IonContent, 
    IonIcon, 
    IonLabel
  ],
})
export class HomePage {

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

  seleccionar(tab: string) {
    console.log('Cambiando a sección:', tab);
  }

}