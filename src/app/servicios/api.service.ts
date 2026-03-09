import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Realiza un GET de prueba al backend Django para comprobar la conexión.
     * @returns Observable con el estado de la API
     */
    checkStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/status/`);
    }

    /**
     * Envía una pregunta al chatbot del backend.
     * @param question Texto de la pregunta del usuario
     * @returns Observable con la respuesta del chatbot
     */
    sendChatMessage(question: string): Observable<any> {
        // Usa environment.apiUrl definido explícitamente para el chatbot ('http://127.0.0.1:8000/chatbot')
        return this.http.post<any>(environment.apiUrl, { question });
    }
}
