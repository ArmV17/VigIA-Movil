import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { documentTextOutline, arrowForwardCircleOutline, closeOutline } from 'ionicons/icons'; 
import { supabase } from '../../supabase';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, CustomNavbarComponent]
})
export class BlogPage implements OnInit {
  posts: any[] = [];

  constructor(private modalCtrl: ModalController) { 
    addIcons({ 
      'document-text-outline': documentTextOutline, 
      'arrow-forward-circle-outline': arrowForwardCircleOutline,
      'close-outline': closeOutline 
    });
  }

  async ngOnInit() {
    await this.cargarPosts();
  }

  async cargarPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('fecha', { ascending: false });

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