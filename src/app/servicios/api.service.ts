import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

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

    checkStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/status/`);
    }

    sendChatMessage(question: string): Observable<any> {
        return this.http.post<any>(environment.apiUrl, { question }).pipe(
            tap(res => {
                if (res && res.success) {
                    this.guardarLocal('last_bot_response', res);
                }
            }),
            catchError(async (err) => {
                console.warn('Error de conexión o servidor. Buscando respaldo local...');
                const fallback = await this.obtenerLocal('last_bot_response');
                if (fallback) {
                    fallback.answer.informacion = "(Modo Sin Internet) " + fallback.answer.informacion;
                    return fallback;
                }
                throw err;
            })
        ) as any;
    }
}