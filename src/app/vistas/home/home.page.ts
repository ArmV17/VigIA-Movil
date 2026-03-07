import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';

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
    CustomNavbarComponent
  ],
})
export class HomePage {

  constructor() {
  }

  seleccionar(tab: string) {
    console.log('Cambiando a sección:', tab);
  }
}