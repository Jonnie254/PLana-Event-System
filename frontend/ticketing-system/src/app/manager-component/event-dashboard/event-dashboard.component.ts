import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-dashboard',
  standalone: true,
  imports: [HomeComponent, RouterLink],
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.css',
})
export class EventDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/landing-page']);
  }
}
