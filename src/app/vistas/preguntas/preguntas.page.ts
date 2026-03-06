import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonContent, IonSearchbar, IonIcon, IonLabel, IonSegment, 
  IonSegmentButton, IonAccordion, IonAccordionGroup, IonItem, 
  IonButton, IonTextarea, IonInput 
} from '@ionic/angular/standalone';

// Iconos y Conexión
import { addIcons } from 'ionicons';
import { 
  home, helpCircle, map, calendar, documentText, ellipsisHorizontal,
  clipboardOutline, helpCircleOutline, arrowForwardOutline, 
  documentTextOutline, paperPlane, searchOutline
} from 'ionicons/icons';

// Importación del cliente de Supabase (ajusta la ruta según tu estructura)
import { supabase } from '../../supabase'; 

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, RouterLinkActive,
    IonContent, IonSearchbar, IonIcon, IonLabel, IonSegment, 
    IonSegmentButton, IonAccordion, IonAccordionGroup, IonItem, 
    IonButton, IonTextarea, IonInput
  ]
})
export class PreguntasPage implements OnInit {
  segmentoActual: string = 'frecuentes';
  textoBusqueda: string = '';
  
  // Arreglo que almacenará los datos de PostgreSQL
  preguntas: any[] = [];

  nuevaPregunta = {
    nombre_persona: '',
    pregunta: '',
    descripcion: '',
    website: '' 
  };

  constructor() {
    addIcons({ 
      home, 'help-circle': helpCircle, map, calendar, 
      'document-text': documentText, 'ellipsis-horizontal': ellipsisHorizontal,
      'clipboard-outline': clipboardOutline, 'help-circle-outline': helpCircleOutline,
      'arrow-forward-outline': arrowForwardOutline, 'document-text-outline': documentTextOutline,
      'paper-plane': paperPlane, 'search-outline': searchOutline
    });
  }

  // Al iniciar la app en tu OnePlus, se cargan los datos
  async ngOnInit() {
    await this.cargarPreguntas();
  }

  /**
   * Obtiene las preguntas desde la base de datos de Supabase
   */
  async cargarPreguntas() {
    try {
      const { data, error } = await supabase
        .from('preguntas_enviadas')
        .select('*')
        // Solo traemos las que ya tienen una respuesta asignada
        .not('respuesta', 'is', null) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.preguntas = data || [];
      
    } catch (err: any) {
      console.error('Error cargando preguntas:', err.message);
    }
  }

  // Filtrado en tiempo real basado en el título de la pregunta
get preguntasFiltradas() {
  return this.preguntas.filter(q => 
    q.pregunta?.toLowerCase().includes(this.textoBusqueda.toLowerCase())
  );
}

  /**
   * Envía una nueva duda a la base de datos
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
      alert("¡Enviada! En breve aparecerá en la sección de frecuentes.");
    } catch (err: any) {
      alert("Error al enviar: " + err.message);
    }
  }

  private limpiarFormulario() {
    this.nuevaPregunta = { nombre_persona: '', pregunta: '', descripcion: '', website: '' };
  }

  abrirEnlace(url: string) {
    if (url) window.open(url, '_blank');
  }
}