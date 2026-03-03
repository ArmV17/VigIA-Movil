import { Component } from '@angular/core';
// Importamos solo lo que realmente usamos en el HTML
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // Necesario para que los iconos funcionen
import { home, chatbubble, map } from 'ionicons/icons'; // Importa los iconos específicos

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  // Agregamos los componentes aquí para que Angular los reconozca
  imports: [IonContent, IonButton, IonIcon, IonLabel],
})
export class HomePage {
  constructor() {
    // Registramos los iconos que vamos a usar
    addIcons({ home, chatbubble, map });
  }
}