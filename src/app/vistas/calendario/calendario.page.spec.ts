import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioPage } from './calendario.page';
import { provideHttpClient } from '@angular/common/http'; // El motor para la API
import { provideRouter } from '@angular/router';

describe('CalendarioPage', () => {
  let component: CalendarioPage;
  let fixture: ComponentFixture<CalendarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioPage],
      providers: [
        provideHttpClient(), // Esto soluciona el error del ApiService
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});