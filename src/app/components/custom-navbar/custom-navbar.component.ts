import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, 
  helpCircle, 
  map, 
  calendar, 
  documentText, 
  ellipsisHorizontal
} from 'ionicons/icons';

@Component({
  selector: 'app-custom-navbar',
  templateUrl: './custom-navbar.component.html',
  styleUrls: ['./custom-navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IonIcon]
})
export class CustomNavbarComponent {
  constructor() {
    addIcons({ 
      home, 
      'help-circle': helpCircle, 
      map, 
      calendar, 
      'document-text': documentText,
      'ellipsis-horizontal': ellipsisHorizontal
    });
  }
}