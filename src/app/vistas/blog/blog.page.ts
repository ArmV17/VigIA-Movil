import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, arrowForwardCircleOutline, closeOutline, personOutline } from 'ionicons/icons';
import { supabase } from '../../supabase';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, CustomNavbarComponent, NgFor, NgIf, DatePipe],
  providers: [ModalController]
})
export class BlogPage implements OnInit {
  posts: any[] = [];

  constructor(private modalCtrl: ModalController) {
    addIcons({
      'document-text-outline': documentTextOutline,
      'arrow-forward-circle-outline': arrowForwardCircleOutline,
      'close-outline': closeOutline,
      'person-outline': personOutline
    });
  }

  async ngOnInit() {
    await this.cargarPosts();
  }

  async cargarPosts() {
    // Apuntamos a la nueva tabla cross_asistent_articulos
    const { data, error } = await supabase
      .from('cross_asistent_articulos')
      .select('*')
      .order('creacion', { ascending: false });

    if (!error) {
      this.posts = data || [];
    }
  }

  async leerMas(post: any) {
    const modal = await this.modalCtrl.create({
      component: BlogDetailComponent,
      componentProps: { post: post }
    });
    return await modal.present();
  }
}