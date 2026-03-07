import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-utc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="top-logo-container">
      <img src="assets/imgs/UTC_logo-plano.webp" alt="Logo UTC" class="main-logo">
    </div>
  `,
  styleUrls: ['./logo-utc.component.scss']
})
export class LogoUtcComponent {}