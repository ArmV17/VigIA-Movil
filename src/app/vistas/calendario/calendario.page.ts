import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonIcon, IonButton, IonFooter, IonTabBar, IonTabButton, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  chevronBack, chevronForward, home, helpCircle, map, calendar, 
  documentText, ellipsisHorizontal, peopleCircleOutline,
  logoFacebook, logoInstagram, logoTiktok,
  timeOutline, locationOutline
} from 'ionicons/icons'; 

// Importa tu servicio de API y componentes
import { ApiService } from '../../servicios/api.service';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';
import { LogoUtcComponent } from '../../components/logo-utc/logo-utc.component';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonButton, IonFooter, IonTabBar, IonTabButton, IonLabel, 
    CommonModule, FormsModule, CustomNavbarComponent, LogoUtcComponent
  ]
})
export class CalendarioPage implements OnInit {
  fechaActual = new Date(); 
  readonly FECHA_REAL = new Date(); 
  
  diasMes: number[] = [];
  rellenoInicial: number[] = [];
  rellenoFinal: number[] = [];
  diaSeleccionado: number = this.fechaActual.getDate();
  nombreMes: string = "";
  anio: number = this.fechaActual.getFullYear();

  // Nombres completos como en la web
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  eventosDB: any[] = [];
  diasConEventos: Set<string> = new Set();

  constructor(private router: Router, private apiService: ApiService) {
    addIcons({ 
      'chevron-back': chevronBack, 'chevron-forward': chevronForward,
      home, 'help-circle': helpCircle, map, calendar, 
      'document-text': documentText, 'ellipsis-horizontal': ellipsisHorizontal,
      'people-circle-outline': peopleCircleOutline,
      logoFacebook, logoInstagram, logoTiktok,
      'time-outline': timeOutline, 'location-outline': locationOutline
    });
  }

  ngOnInit() {
    this.cargarDatosCalendario();
    this.generarCalendario();
  }

  /**
   * Carga los eventos usando el sistema de caché de tu ApiService.
   * El API de Django devuelve: titulo, informacion, evento_fecha_inicio,
   * evento_fecha_fin, evento_allDay, evento_lugar, evento_className, imagen
   */
  cargarDatosCalendario() {
    this.apiService.obtenerDatosConCache('eventos_utc').subscribe({
      next: (data) => {
        if (data) {
          this.eventosDB = data;
          this.indexarEventos();
        }
      },
      error: (err) => console.error('Error cargando calendario:', err)
    });
  }

  /**
   * Indexa las fechas que tienen eventos para un lookup rápido O(1)
   */
  private indexarEventos() {
    this.diasConEventos.clear();
    this.eventosDB.forEach(ev => {
      if (!ev.evento_fecha_inicio) return;
      const start = ev.evento_fecha_inicio.substring(0, 10); // YYYY-MM-DD
      const end = ev.evento_fecha_fin ? ev.evento_fecha_fin.substring(0, 10) : start;
      
      // Mark each day in the range
      const dStart = new Date(start + 'T00:00:00');
      const dEnd = new Date(end + 'T00:00:00');
      const cur = new Date(dStart);
      while (cur <= dEnd) {
        this.diasConEventos.add(this.toDateKey(cur));
        cur.setDate(cur.getDate() + 1);
      }
    });
  }

  // --- LÓGICA DE RENDERIZADO ---
  esHoy(dia: number): boolean {
    return dia === this.FECHA_REAL.getDate() && 
           this.fechaActual.getMonth() === this.FECHA_REAL.getMonth() && 
           this.fechaActual.getFullYear() === this.FECHA_REAL.getFullYear();
  }

  tieneEventos(dia: number): boolean {
    const key = `${this.anio}-${String(this.fechaActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return this.diasConEventos.has(key);
  }

  generarCalendario() {
    const mes = this.fechaActual.getMonth();
    const anio = this.fechaActual.getFullYear();
    this.nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.fechaActual);
    this.anio = anio;
    const numDias = new Date(anio, mes + 1, 0).getDate();
    this.diasMes = Array.from({ length: numDias }, (_, i) => i + 1);
    
    // Relleno inicial (mes anterior)
    let primerDiaSemana = new Date(anio, mes, 1).getDay();
    const desplazamiento = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    const diasMesAnterior = new Date(anio, mes, 0).getDate();
    this.rellenoInicial = Array.from({ length: desplazamiento }, (_, i) => diasMesAnterior - (desplazamiento - 1) + i);
    
    // Relleno final (mes siguiente) - para completar la última fila
    const totalCeldas = this.rellenoInicial.length + numDias;
    const celdasFaltantes = totalCeldas % 7 === 0 ? 0 : 7 - (totalCeldas % 7);
    this.rellenoFinal = Array.from({ length: celdasFaltantes }, (_, i) => i + 1);
  }

  /**
   * Returns all events for the selected day.
   * Checks if the selected date falls within each event's start-end range.
   */
  getEventosDelDia(): any[] {
    const selDate = `${this.anio}-${String(this.fechaActual.getMonth() + 1).padStart(2, '0')}-${String(this.diaSeleccionado).padStart(2, '0')}`;
    
    return this.eventosDB.filter(ev => {
      if (!ev.evento_fecha_inicio) return false;
      const start = ev.evento_fecha_inicio.substring(0, 10);
      const end = ev.evento_fecha_fin ? ev.evento_fecha_fin.substring(0, 10) : start;
      return selDate >= start && selDate <= end;
    });
  }

  /**
   * Format event time for display
   */
  formatTime(ev: any): string {
    if (ev.evento_allDay) return 'Todo el día';
    if (!ev.evento_fecha_inicio) return '';
    const d = new Date(ev.evento_fecha_inicio);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  private toDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  mesSiguiente() { this.fechaActual.setMonth(this.fechaActual.getMonth() + 1); this.generarCalendario(); }
  mesAnterior() { this.fechaActual.setMonth(this.fechaActual.getMonth() - 1); this.generarCalendario(); }
  seleccionarDia(dia: number) { this.diaSeleccionado = dia; }
}