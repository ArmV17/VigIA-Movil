import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf, DatePipe, SlicePipe } from '@angular/common'; // Añadimos SlicePipe
import { 
  IonContent, 
  IonIcon, 
  ModalController, 
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  documentTextOutline, 
  arrowForwardCircleOutline, 
  closeOutline, 
  personOutline,
  refreshOutline 
} from 'ionicons/icons';

import { ApiService } from '../../servicios/api.service';
import { LogoUtcComponent } from '../../components/logo-utc/logo-utc.component';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    IonIcon, 
    IonSpinner,
    IonRefresher,        
    IonRefresherContent,
    IonSkeletonText,
    IonButton,  
    CustomNavbarComponent, 
    NgFor, 
    NgIf, 
    DatePipe,
    SlicePipe,    
    LogoUtcComponent
  ],
  providers: [ModalController]
})
export class BlogPage implements OnInit {
  posts: any[] = [];
  cargando: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      'document-text-outline': documentTextOutline,
      'arrow-forward-circle-outline': arrowForwardCircleOutline,
      'close-outline': closeOutline,
      'person-outline': personOutline,
      'refresh-outline': refreshOutline
    });
  }

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.cargando = true;
    this.apiService.obtenerDatosConCache('cross_asistent_articulos').subscribe({
      next: (data) => {
        this.posts = data || [];
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error en Blog:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleRefresh(event: any) {
    this.apiService.obtenerDatosConCache('cross_asistent_articulos').subscribe({
      next: (data) => {
        this.posts = data || [];
        event.target.complete();
        this.cdr.detectChanges();
      },
      error: () => event.target.complete()
    });
  }

  async leerMas(post: any) {
    const modal = await this.modalCtrl.create({
      component: BlogDetailComponent,
      componentProps: { post: post }
    });
    return await modal.present();
  }
}