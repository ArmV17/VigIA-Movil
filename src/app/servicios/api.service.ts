import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '../supabase'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Centralizamos las URLs desde environment [cite: 39, 48]
  private baseUrl = environment.apiBaseUrl;
  private chatUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // --- PERSISTENCIA NATIVA (Capacitor Preferences)  ---
  
  async guardarLocal(llave: string, valor: any) {
    await Preferences.set({
      key: llave,
      value: JSON.stringify(valor)
    });
  }

  async obtenerLocal(llave: string) {
    const { value } = await Preferences.get({ key: llave });
    return value ? JSON.parse(value) : null;
  }

  // --- LÓGICA DE DATOS CON CACHÉ (Blog, Preguntas, Calendario) [cite: 36, 37] ---

  /**
   * Obtiene datos de Supabase con respaldo offline automático.
   * Prioriza la carga de red pero devuelve el caché si no hay internet.
   */
  obtenerDatosConCache(tabla: string): Observable<any[]> {
    return from(this.obtenerLocal(`cache_${tabla}`)).pipe(
      switchMap(cache => {
        // Ajuste dinámico de la columna de ordenamiento según tu tabla de Supabase 
        const columnaOrden = (tabla === 'cross_asistent_articulos') ? 'creacion' : 'created_at';

        const obsSupabase = from(
          supabase.from(tabla)
            .select('*')
            .order(columnaOrden, { ascending: false })
        ).pipe(
          map(({ data, error }) => {
            if (error) {
              console.error(`Error Supabase [${tabla}]:`, error.message);
              throw error;
            }
            if (data && data.length > 0) {
              // Actualizamos el "baúl" del celular con datos frescos 
              this.guardarLocal(`cache_${tabla}`, data);
              return data;
            }
            return cache || [];
          }),
          catchError((err) => {
            console.warn(`VigIA Offline - Usando caché para: ${tabla}`);
            return of(cache || []);
          })
        );

        return obsSupabase; 
      })
    );
  }

  // --- CHATBOT ASISTENTE [cite: 31, 83] ---

  sendChatMessage(question: string): Observable<any> {
    return this.http.post<any>(this.chatUrl, { question }).pipe(
      tap(res => {
        if (res && res.success) {
          // Guardamos la última respuesta exitosa para el modo offline 
          this.guardarLocal('last_bot_response', res);
        }
      }),
      catchError(async (err) => {
        console.warn('Asistente VigIA: Error de red. Buscando última respuesta...');
        const fallback = await this.obtenerLocal('last_bot_response');
        if (fallback) {
          if (fallback.answer) {
            fallback.answer.informacion = "(Modo Offline) " + fallback.answer.informacion;
          }
          return fallback;
        }
        throw err;
      })
    ) as any;
  }

  // --- VERIFICACIÓN DE ESTADO ---

  checkStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/`);
  }
}