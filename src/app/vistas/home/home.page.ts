import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonContent, IonIcon, IonLabel, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home,
  helpCircle,
  map,
  calendar,
  documentText,
  ellipsisHorizontal
} from 'ionicons/icons';
import { VigiaModalComponent } from './vigía-modal/vigia-modal.component';

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

  constructor(private modalController: ModalController) {
    addIcons({
      home,
      'help-circle': helpCircle,
      map,
      calendar,
      'document-text': documentText,
      'ellipsis-horizontal': ellipsisHorizontal
    });
  }

  async openVigiaChat() {
    const modal = await this.modalController.create({
      component: VigiaModalComponent,
      cssClass: 'vigia-modal',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
    });
    await modal.present();
  }

  seleccionar(tab: string) {
    console.log('Cambiando a sección:', tab);
  }

}