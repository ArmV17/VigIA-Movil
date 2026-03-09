import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { chevronBack, chevronForward } from 'ionicons/icons'; 

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule, FormsModule]
})
export class CalendarioPage implements OnInit {
  // Variables dinámicas
  fechaActual = new Date(); 
  diasMes: number[] = [];
  rellenoInicial: number[] = [];
  diaSeleccionado: number = this.fechaActual.getDate();
  nombreMes: string = "";
  anio: number = this.fechaActual.getFullYear();

  constructor() {
    addIcons({ 'chevron-back': chevronBack, 'chevron-forward': chevronForward });
  }

  ngOnInit() {
    this.generarCalendario();
  }

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

  // Funciones para que las flechas funcionen
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
}