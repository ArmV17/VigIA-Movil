import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone'; 
import { addIcons } from 'ionicons'; 
import { documentTextOutline, arrowForwardCircleOutline } from 'ionicons/icons'; 
import { supabase } from '../../supabase';
// IMPORTANTE: Importamos el componente de la Navbar
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    IonIcon,
    CustomNavbarComponent // Lo agregamos a los imports del componente
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