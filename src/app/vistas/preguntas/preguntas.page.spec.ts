import { PreguntasPage } from './preguntas.page';
import { of } from 'rxjs';

describe('PreguntasPage - Pruebas de Lógica de Negocio', () => {
  let component: PreguntasPage;
  let apiServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['obtenerDatosConCache']);
    apiServiceSpy.obtenerDatosConCache.and.returnValue(of([]));
    component = new PreguntasPage(apiServiceSpy);
  });

  // PRUEBA 1: Validar que la encriptación funcione
  it('Debe transformar un texto plano en un código encriptado (Base64)', () => {
    const textoOriginal = '¿Donde esta la Rectoría?';
    const resultado = component.encriptarTexto(textoOriginal);
    
    expect(resultado).not.toBe(textoOriginal); // Verifica que el texto cambió
    expect(resultado.length).toBeGreaterThan(0); // Verifica que generó un código
  });

  // PRUEBA 2: Validar la reversibilidad (Round-trip)
  it('Debe recuperar exactamente el texto original al desencriptar', () => {
    const textoOriginal = 'Información TI';
    const encriptado = component.encriptarTexto(textoOriginal);
    const desencriptado = component.desencriptarTexto(encriptado);
    
    expect(desencriptado).toBe(textoOriginal); // Verifica que la lógica es exacta
  });

  // PRUEBA 3: Validar manejo de casos vacíos (Robustez)
  it('Debe manejar strings vacíos sin tronar la aplicación', () => {
    const resultado = component.encriptarTexto('');
    expect(resultado).toBe(''); // Verifica que el sistema no falla con datos nulos
  });
});