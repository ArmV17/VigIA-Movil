import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoUtcComponent } from '../../components/logo-utc/logo-utc.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonContent, IonSearchbar, IonIcon, IonLabel, IonSegment,
  IonSegmentButton, IonAccordion, IonAccordionGroup, IonItem,
  IonButton, IonTextarea, IonInput
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  clipboardOutline, helpCircleOutline, arrowForwardOutline,
  documentTextOutline, paperPlane, searchOutline
} from 'ionicons/icons';

// Servicios y Navbar
import { ApiService } from '../../servicios/api.service';
import { supabase } from '../../supabase';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, RouterLinkActive,
    IonContent, IonSearchbar, IonIcon, IonLabel, IonSegment,
    IonSegmentButton, IonAccordion, IonAccordionGroup, IonItem,
    IonButton, IonTextarea, IonInput, LogoUtcComponent,
    CustomNavbarComponent
  ]
})
export class PreguntasPage implements OnInit {
  segmentoActual: string = 'frecuentes';
  textoBusqueda: string = '';
  preguntas: any[] = [];

  nuevaPregunta = {
    nombre_persona: '',
    pregunta: '',
    descripcion: '',
    website: ''
  };

  constructor(private apiService: ApiService) { // Inyectamos el ApiService
    addIcons({
      'clipboard-outline': clipboardOutline,
      'help-circle-outline': helpCircleOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'document-text-outline': documentTextOutline,
      'paper-plane': paperPlane,
      'search-outline': searchOutline
    });
  }

  ngOnInit() {
    this.cargarPreguntas();
  }

  /**
   * Carga las preguntas usando el sistema de caché nativo del ApiService
   */
  cargarPreguntas() {
    // Usamos el método con caché para la tabla 'preguntas_enviadas'
    this.apiService.obtenerDatosConCache('preguntas_enviadas').subscribe({
      next: (data) => {
        // Filtramos las que tienen respuesta (como hacías antes)
        this.preguntas = (data || []).filter((q: any) => q.pregunta && q.respuesta);
      },
      error: (err) => {
        console.error('Error al cargar preguntas:', err);
      }
    });
  }

  get preguntasFiltradas() {
    return this.preguntas.filter(q =>
      q.pregunta?.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  /**
   * El envío se queda igual (requiere internet para insertar en Supabase)
   */
  async enviarPregunta() {
    if (this.nuevaPregunta.website !== '') return;
    if (this.nuevaPregunta.pregunta.length < 10) {
      alert("La pregunta debe tener al menos 10 caracteres.");
      return;
    }

    try {
      const { error } = await supabase
        .from('preguntas_enviadas')
        .insert([{
          nombre_persona: this.nuevaPregunta.nombre_persona,
          pregunta: this.nuevaPregunta.pregunta,
          descripcion: this.nuevaPregunta.descripcion
        }]);

      if (error) throw error;
      this.limpiarFormulario();
      alert("Enviada con éxito.");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  private limpiarFormulario() {
    this.nuevaPregunta = { nombre_persona: '', pregunta: '', descripcion: '', website: '' };
  }

  abrirEnlace(url: string) {
    if (url) window.open(url, '_blank');
  }
}