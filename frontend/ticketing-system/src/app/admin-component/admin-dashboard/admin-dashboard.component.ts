import { Component } from '@angular/core';
import { User } from '../../interfaces/users';
import { AuthService } from '../../services/auth.service';
import { ManageUserService } from '../../services/manage-user.service';
import { AdminHomeComponent } from '../admin-home/admin-home.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminHomeComponent, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
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
