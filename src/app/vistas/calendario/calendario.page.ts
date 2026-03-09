import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { 
  IonContent, IonIcon, IonButton, IonFooter, IonTabBar, IonTabButton, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  chevronBack, 
  chevronForward, 
  home, 
  helpCircle, 
  map, 
  calendar, 
  documentText, 
  ellipsisHorizontal,
  peopleCircleOutline
} from 'ionicons/icons'; 

// Importa tu cliente de Supabase
import { supabase } from '../../supabase'; 

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
  diaSeleccionado: number = this.fechaActual.getDate();
  nombreMes: string = "";
  anio: number = this.fechaActual.getFullYear();

  // Datos de Supabase
  eventosDB: any[] = [];
  coloresCeldas: { [key: string]: string } = {};

  constructor(private router: Router) {
    addIcons({ 
      'chevron-back': chevronBack, 'chevron-forward': chevronForward,
      home, 'help-circle': helpCircle, map, calendar, 
      'document-text': documentText, 'ellipsis-horizontal': ellipsisHorizontal,
      'people-circle-outline': peopleCircleOutline
    });
  }

  async ngOnInit() {
    await this.cargarEventosDesdeSupabase();
    this.generarCalendario();
  }

  /**
   * Verifica si el día que se está renderizando es HOY
   */
  esHoy(dia: number): boolean {
    return dia === this.FECHA_REAL.getDate() && 
           this.fechaActual.getMonth() === this.FECHA_REAL.getMonth() && 
           this.fechaActual.getFullYear() === this.FECHA_REAL.getFullYear();
  }

  async cargarEventosDesdeSupabase() {
    try {
      const { data, error } = await supabase.from('eventos_utc').select('*');
      if (error) throw error;
      if (data) {
        this.eventosDB = data;
        this.coloresCeldas = {};
        data.forEach(ev => {
          const f = new Date(ev.fecha + 'T00:00:00');
          const clave = `${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}`;
          this.coloresCeldas[clave] = ev.color_hex;
        });
      }
    } catch (err) {
      console.error('Error en Supabase:', err);
    }
  }

  generarCalendario() {
    const mes = this.fechaActual.getMonth();
    const anio = this.fechaActual.getFullYear();
    this.nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.fechaActual);
    this.anio = anio;

    const numDias = new Date(anio, mes + 1, 0).getDate();
    this.diasMes = Array.from({ length: numDias }, (_, i) => i + 1);

    let primerDiaSemana = new Date(anio, mes, 1).getDay();
    const desplazamiento = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    const diasMesAnterior = new Date(anio, mes, 0).getDate();
    this.rellenoInicial = Array.from({ length: desplazamiento }, (_, i) => diasMesAnterior - (desplazamiento - 1) + i);
  }

  getClaveFecha(dia: number): string {
    return `${this.anio}-${this.fechaActual.getMonth() + 1}-${dia}`;
  }

  getEventoDelDia() {
    const claveBusqueda = this.getClaveFecha(this.diaSeleccionado);
    return this.eventosDB.find(ev => {
      const f = new Date(ev.fecha + 'T00:00:00');
      const claveEv = `${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}`;
      return claveEv === claveBusqueda;
    });
  }

  async solicitarGPS() {
  const status = await Geolocation.checkPermissions();

  if (status.location !== 'granted') {
    const request = await Geolocation.requestPermissions();
    if (request.location === 'granted') {
      this.obtenerUbicacion();
    }
  } else {
    this.obtenerUbicacion();
  }
}

async obtenerUbicacion() {
  const coordinates = await Geolocation.getCurrentPosition();
  console.log('Mi ubicación es:', coordinates);
}

  mesSiguiente() { this.fechaActual.setMonth(this.fechaActual.getMonth() + 1); this.generarCalendario(); }
  mesAnterior() { this.fechaActual.setMonth(this.fechaActual.getMonth() - 1); this.generarCalendario(); }
  seleccionarDia(dia: number) { this.diaSeleccionado = dia; }
}