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
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // --- PERSISTENCIA NATIVA (Capacitor Preferences) ---
  
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

  // --- LÓGICA DE DATOS CON CACHÉ (Blog, Preguntas, Calendario) ---

  /**
   * Esta función es la "maestra" para traer datos de Supabase.
   * 1. Busca en el celular (Caché) y lo entrega de inmediato.
   * 2. Intenta ir a Supabase, si hay datos nuevos, actualiza el caché y la vista.
   */

// En api.service.ts
obtenerDatosConCache(tabla: string): Observable<any[]> {
  return from(this.obtenerLocal(`cache_${tabla}`)).pipe(
    switchMap(cache => {
      // Si hay cache, lo entregamos primero para que no se vea vacío
      const obsCache = of(cache || []);
      
      // Petición a Supabase
      const obsSupabase = from(supabase.from(tabla).select('*')).pipe(
        map(({ data, error }) => {
          if (error) throw error;
          if (data && data.length > 0) {
            this.guardarLocal(`cache_${tabla}`, data);
            return data;
          }
          return cache || [];
        }),
        catchError(() => of(cache || []))
      );
      
      return obsSupabase; 
    })
  );
}

  // --- CHATBOT ASISTENTE ---

  sendChatMessage(question: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl, { question }).pipe(
      tap(res => {
        if (res && res.success) {
          this.guardarLocal('last_bot_response', res);
        }
      }),
      catchError(async (err) => {
        const fallback = await this.obtenerLocal('last_bot_response');
        if (fallback) {
          fallback.answer.informacion = "(Modo Offline) " + fallback.answer.informacion;
          return fallback;
        }
        throw err;
      })
    ) as any;
  }

  checkStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/`);
  }
}