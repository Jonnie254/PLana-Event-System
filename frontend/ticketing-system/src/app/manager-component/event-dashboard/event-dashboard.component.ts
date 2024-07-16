import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ManageUserService } from '../../services/manage-user.service';
import { User } from '../../interfaces/users';

@Component({
  selector: 'app-event-dashboard',
  standalone: true,
  imports: [HomeComponent, RouterLink],
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.css',
})
export class EventDashboardComponent {
  user: User = {} as User;
  constructor(
    private authService: AuthService,
    private manageUserService: ManageUserService
  ) {
    this.manageUserService.currentUser$.subscribe((user) => {
      if (user !== null) {
        this.user = user;
      }
    });
  }
  logout() {
    this.authService.logout();
  }
}
