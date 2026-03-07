import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone'; // Importaciones necesarias
import { addIcons } from 'ionicons'; // Para registrar iconos
import { documentTextOutline, arrowForwardCircleOutline } from 'ionicons/icons'; 
import { supabase } from '../../supabase';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, // Agregado para corregir NG8001 y NG8002
    IonIcon     // Agregado para corregir NG8001
  ]
})
export class BlogPage implements OnInit {
  posts: any[] = [];

  constructor() {
    addIcons({ 
      'document-text-outline': documentTextOutline, 
      'arrow-forward-circle-outline': arrowForwardCircleOutline 
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

  leerMas(post: any) {
    console.log('Abriendo:', post.titulo);
  }
}