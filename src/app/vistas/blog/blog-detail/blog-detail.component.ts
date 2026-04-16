import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  ModalController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  closeOutline, calendarOutline, cameraOutline, imagesOutline,
  expandOutline, logoFacebook, logoInstagram, logoTiktok 
} from 'ionicons/icons';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon
  ],
  template: `
    <!-- Botón de cerrar flotante -->
    <ion-header class="ion-no-border" style="position: absolute; top: 0; left: 0; right: 0; z-index: 10;">
      <ion-toolbar style="--background: transparent; --color: white; --border-width: 0;">
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()" style="background: rgba(0,0,0,0.45); border-radius: 50%; width: 36px; height: 36px; margin: 10px 12px 0 0;">
            <ion-icon name="close-outline" style="font-size: 22px; color: white;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #0f172a; color: white;" [fullscreen]="true">
      
      <!-- ═══════ IMAGEN DE PORTADA ═══════ -->
      <div *ngIf="post.encabezado" style="position: relative;">
        <img [src]="post.encabezado" style="width: 100%; height: 340px; object-fit: cover; display: block;">
        <span style="position: absolute; bottom: 8px; right: 14px; font-size: 11px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 4px; text-shadow: 0 1px 4px rgba(0,0,0,0.9);">
          <ion-icon name="camera-outline"></ion-icon> Archivo / Portada Oficial
        </span>
      </div>

      <!-- ═══════ BADGE + TÍTULO + DESCRIPCIÓN + AUTOR ═══════ -->
      <div style="padding: 24px 24px 0 24px;">
        <span style="background-color: #0ea5e9; color: white; display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.15);">
          Blog UTC
        </span>
        
        <h1 style="color: #ffffff; font-weight: 800; font-size: 2rem; line-height: 1.2; margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif;">
          {{ post.titulo }}
        </h1>
        
        <p *ngIf="post.descripcion_breve" style="color: rgba(255,255,255,0.5); font-size: 1rem; line-height: 1.5; margin: 0 0 20px 0;">
          {{ post.descripcion_breve }}
        </p>
        
        <div style="margin-bottom: 20px;">
          <span style="color: #0ea5e9; font-weight: 800; text-transform: uppercase; font-size: 13px; display: block; margin-bottom: 6px;">
            {{ post.autor }}
          </span>
          <span style="color: rgba(255,255,255,0.6); font-size: 13px; display: flex; align-items: center; gap: 6px;">
            <ion-icon name="calendar-outline" style="font-size: 14px;"></ion-icon>
            {{ post.creacion | date:'mediumDate' }}
          </span>
        </div>
      </div>
      
      <!-- ═══════ SEPARADOR + CONTENIDO ═══════ -->
      <div style="padding: 0 24px;">
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 8px 0 24px 0;">
        
        <!-- Párrafos del artículo renderizados individualmente -->
        <div *ngFor="let parrafo of parrafos" style="margin-bottom: 16px;">
          <p style="color: rgba(255,255,255,0.85); font-size: 16px; line-height: 1.75; margin: 0;">
            {{ parrafo }}
          </p>
        </div>
      </div>

      <!-- ═══════ ÁLBUM DE ACONTECIMIENTOS ═══════ -->
      <div *ngIf="post.album && post.album.length > 0" style="padding: 0 24px;">
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;">
        <h3 style="color: #ffffff; font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <ion-icon name="images-outline" style="font-size: 22px;"></ion-icon> Álbum de los Acontecimientos
        </h3>
        
        <div class="album-list">
          <div *ngFor="let img of post.album; let i = index" class="album-card" (click)="openLightbox(i)">
            <img [src]="img" class="album-card-img">
            <div class="album-expand-icon">
              <ion-icon name="expand-outline"></ion-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ FOOTER ═══════ -->
      <footer class="blog-footer">
        <div class="footer-brand">
          <h6>Asistente UTC</h6>
          <p>Una herramienta de la UTC para resolver y atender tus dudas.</p>
        </div>
        
        <div class="footer-links">
          <h6>UTC</h6>
          <a href="https://utc.edu.mx/index.php/t-escolares/" target="_blank">Trámites</a>
          <a href="https://utc.edu.mx/index.php/becas/" target="_blank">Becas</a>
          <a href="https://utc.edu.mx/index.php/322-2/" target="_blank">Oferta Educativa</a>
        </div>

        <div class="footer-social">
          <a href="https://www.facebook.com/UniversidadTecnologicadeCoahuila/" target="_blank">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
          <a href="https://www.instagram.com/utcoahuila/" target="_blank">
            <ion-icon name="logo-instagram"></ion-icon>
          </a>
          <a href="https://www.tiktok.com/@utdecoahuila" target="_blank">
            <ion-icon name="logo-tiktok"></ion-icon>
          </a>
        </div>

        <div class="footer-copyright">
          © 2026 Todos los Derechos reservados: Universidad Tecnológica de Coahuila
        </div>
      </footer>

    </ion-content>

    <!-- ═══════ LIGHTBOX PANTALLA COMPLETA ═══════ -->
    <div class="lightbox-overlay" *ngIf="lightboxOpen" (click)="closeLightboxBg($event)">
      <button class="lightbox-close" (click)="closeLightbox()">✕</button>
      <button class="lightbox-prev" (click)="prevImage()">‹</button>
      <img [src]="post.album[lightboxIndex]" class="lightbox-img">
      <button class="lightbox-next" (click)="nextImage()">›</button>
      <span class="lightbox-counter">{{ lightboxIndex + 1 }} / {{ post.album.length }}</span>
    </div>
  `,
  styles: [`
    /* ── Álbum en columna única (igual que web en mobile) ── */
    .album-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 30px;
    }

    .album-card {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      background: #1a273a;
    }

    .album-card-img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }

    .album-card:active .album-card-img {
      transform: scale(1.05);
    }

    .album-expand-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 6px;
      border-radius: 6px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(3px);
    }

    /* ── Footer ── */
    .blog-footer {
      margin-top: 40px;
      padding: 30px 24px 100px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.15);
    }

    .footer-brand h6,
    .footer-links h6 {
      color: #ffffff;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 13px;
      margin: 0 0 10px 0;
      letter-spacing: 0.5px;
    }

    .footer-brand p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }

    .footer-links {
      margin-bottom: 24px;
    }

    .footer-links a {
      display: block;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      text-decoration: none;
      padding: 3px 0;
    }

    .footer-social {
      display: flex;
      justify-content: center;
      gap: 24px;
      padding: 20px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      margin-bottom: 16px;
    }

    .footer-social a {
      color: rgba(255, 255, 255, 0.5);
      font-size: 22px;
      text-decoration: none;
    }

    .footer-copyright {
      text-align: center;
      color: rgba(255, 255, 255, 0.35);
      font-size: 12px;
      padding-top: 8px;
    }

    /* ── Lightbox Pantalla Completa ── */
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 25, 0.97);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
    }

    .lightbox-img {
      max-width: 92vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }

    .lightbox-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: white;
      font-size: 28px;
      cursor: pointer;
      text-shadow: 0 0 8px rgba(0,0,0,0.8);
      z-index: 10;
    }

    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: white;
      font-size: 48px;
      cursor: pointer;
      text-shadow: 0 0 10px rgba(0,0,0,0.8);
      z-index: 10;
      padding: 10px;
    }

    .lightbox-prev { left: 8px; }
    .lightbox-next { right: 8px; }

    .lightbox-counter {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      font-family: monospace;
      letter-spacing: 2px;
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  @Input() post: any;
  parrafos: string[] = [];
  lightboxOpen = false;
  lightboxIndex = 0;

  constructor(private modalCtrl: ModalController) {
    addIcons({ 
      closeOutline, calendarOutline, cameraOutline, imagesOutline,
      expandOutline, logoFacebook, logoInstagram, logoTiktok
    });
  }

  ngOnInit() {
    // Procesar el contenido: limpiar saltos de línea excesivos y separar en párrafos
    if (this.post && this.post.contenido) {
      const texto = this.post.contenido
        .replace(/\r\n/g, '\n')        // Normalizar saltos
        .replace(/\n{3,}/g, '\n\n')     // Colapsar 3+ saltos a 2
        .trim();
      
      this.parrafos = texto
        .split('\n\n')                  // Separar en párrafos por doble salto
        .map((p: string) => p.trim())   // Limpiar espacios
        .filter((p: string) => p.length > 0);  // Quitar vacíos
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  openLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
  }

  closeLightboxBg(event: any) {
    if (event.target.classList.contains('lightbox-overlay')) {
      this.closeLightbox();
    }
  }

  prevImage() {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.post.album.length) % this.post.album.length;
  }

  nextImage() {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.post.album.length;
  }
}