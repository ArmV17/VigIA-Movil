import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ApiService } from './servicios/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    console.log('--- Iniciando prueba de conexión con Django API ---');
    this.apiService.checkStatus().subscribe({
      next: (res) => {
        console.log('✅ Conexión exitosa. Respuesta de Django:', res);
      },
      error: (err) => {
        console.error('❌ Error conectando con Django API:', err);
      }
    });
  }
}
