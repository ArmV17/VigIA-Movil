import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  ModalController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #0a192f; --color: white;">
        <ion-title>Artículo</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #0a192f; color: white;">
      <div class="img-wrapper" *ngIf="post.encabezado">
        <img [src]="post.encabezado" class="full-img">
      </div>
      
      <div style="padding: 20px;">
        <h1 style="color: #3b82f6; font-weight: 800; margin-bottom: 10px;">{{ post.titulo }}</h1>
        <p style="color: #8a9bb8; font-size: 14px;">Por: {{ post.autor }} | {{ post.creacion | date }}</p>
        
        <hr style="border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
        
        <div class="article-content">
          {{ post.contenido }}
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    /* Este contenedor asegura que la imagen no se corte */
    .img-wrapper {
      width: 100%;
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.2); /* Sutil contraste para el logo */
      padding: 20px; /* Espacio para que el águila no toque los bordes */
      overflow: hidden;
    }

    .full-img {
      max-width: 100%;
      max-height: 100%;
      /* Cambiamos 'cover' por 'contain' para que se vea completa */
      object-fit: contain; 
      /* Añadimos sombra para que resalte como en tu diseño */
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
    }

    .article-content {
      line-height: 1.6; 
      color: #cbd5e1; 
      font-size: 16px;
      white-space: pre-line; /* Mantiene los saltos de línea del texto */
    }
  `]
})
export class BlogDetailComponent {
  @Input() post: any;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}