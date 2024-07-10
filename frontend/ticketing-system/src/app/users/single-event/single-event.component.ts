import { Component } from '@angular/core';
import { NavbarComponent } from '../../user-component/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-event',
  standalone: true,
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css',
  imports: [NavbarComponent, RouterLink],
})
export class SingleEventComponent {}
