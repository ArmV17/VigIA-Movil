import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #0a192f; --color: white;">
        <ion-title>{{ post.categoria }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #0a192f; color: white;">
      <img *ngIf="post.imagen_url" [src]="post.imagen_url" style="width: 100%; height: 250px; object-fit: cover;">
      
      <div style="padding: 20px;">
        <h1 style="color: #3b82f6; font-weight: 800;">{{ post.titulo }}</h1>
        <p style="color: #8a9bb8; font-size: 0.9em;">Publicado el {{ post.fecha | date:'longDate' }}</p>
        <hr style="border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
        <div style="line-height: 1.6; font-size: 1.1em; color: #cbd5e1;">
          {{ post.contenido }}
        </div>
      </div>
    </ion-content>
  `
})
export class BlogDetailComponent {
  @Input() post: any;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}