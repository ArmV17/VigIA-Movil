import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logoFacebook, logoInstagram, logoTiktok, logoTwitter, peopleCircleOutline } from 'ionicons/icons';
import { LogoUtcComponent } from '../../components/logo-utc/logo-utc.component';
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';

@Component({
  selector: 'app-otros',
  templateUrl: './otros.page.html',
  styleUrls: ['./otros.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, LogoUtcComponent, CustomNavbarComponent]
})
export class OtrosPage {
  constructor() {
    addIcons({ logoFacebook, logoInstagram, logoTiktok, logoTwitter, peopleCircleOutline });
  }
}