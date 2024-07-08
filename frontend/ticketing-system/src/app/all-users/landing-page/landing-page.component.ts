import { Component } from '@angular/core';
import { NavbarComponent } from '../../user-component/navbar/navbar.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  imports: [NavbarComponent],
})
export class LandingPageComponent {}
