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
  documentText, ellipsisHorizontal 
} from 'ionicons/icons'; 
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component'; // Verifica la ruta
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonButton, IonFooter, IonTabBar, 
    IonTabButton, IonLabel, CommonModule, FormsModule, CustomNavbarComponent
  ]
})
export class CalendarioPage implements OnInit {
  // Variables de estado
  fechaActual = new Date(); 
  diasMes: number[] = [];
  rellenoInicial: number[] = [];
  diaSeleccionado: number = this.fechaActual.getDate();
  nombreMes: string = "";
  anio: number = this.fechaActual.getFullYear();

  // Sistema de Eventos para VigIA
  eventosGuardados: { [key: string]: string } = {};
  nuevoEvento: string = "";

  constructor(private router: Router) {
    // Registramos todos los iconos necesarios
    addIcons({ 
      'chevron-back': chevronBack, 
      'chevron-forward': chevronForward,
      home, 
      'help-circle': helpCircle, 
      map, 
      calendar, 
      'document-text': documentText, 
      'ellipsis-horizontal': ellipsisHorizontal 
    });
  }

  ngOnInit() {
    this.cargarEventos(); 
    this.generarCalendario();
  }

  // --- LÓGICA DEL CALENDARIO ---
  generarCalendario() {
    const mes = this.fechaActual.getMonth();
    const anio = this.fechaActual.getFullYear();

    this.nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.fechaActual).toUpperCase();
    this.anio = anio;

    const numDias = new Date(anio, mes + 1, 0).getDate();
    this.diasMes = Array.from({ length: numDias }, (_, i) => i + 1);

    let primerDiaSemana = new Date(anio, mes, 1).getDay();
    const desplazamiento = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    const diasMesAnterior = new Date(anio, mes, 0).getDate();
    this.rellenoInicial = Array.from(
      { length: desplazamiento }, 
      (_, i) => diasMesAnterior - (desplazamiento - 1) + i
    );
  }

  mesSiguiente() {
    this.fechaActual.setMonth(this.fechaActual.getMonth() + 1);
    this.generarCalendario();
  }

  mesAnterior() {
    this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
    this.generarCalendario();
  }

  seleccionarDia(dia: number) {
    this.diaSeleccionado = dia;
  }

  // --- SISTEMA DE PERSISTENCIA (LocalStorage) ---
  getClaveFecha(dia: number): string {
    return `${this.anio}-${this.fechaActual.getMonth() + 1}-${dia}`;
  }

  guardarEvento() {
    if (this.nuevoEvento.trim().length > 0) {
      const clave = this.getClaveFecha(this.diaSeleccionado);
      this.eventosGuardados[clave] = this.nuevoEvento;
      localStorage.setItem('eventosVigIA', JSON.stringify(this.eventosGuardados));
      this.nuevoEvento = ""; 
    }
  }

  cargarEventos() {
    const datos = localStorage.getItem('eventosVigIA');
    if (datos) {
      this.eventosGuardados = JSON.parse(datos);
    }
  }

  navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }
}