import { Component } from '@angular/core';
import { NavbarComponent } from '../../user-component/navbar/navbar.component';

@Component({
  selector: 'app-single-event',
  standalone: true,
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css',
  imports: [NavbarComponent],
})
export class SingleEventComponent {}
