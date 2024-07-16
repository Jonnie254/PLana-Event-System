import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User, userRegister } from '../../interfaces/users';
import { ManageUserService } from '../../services/manage-user.service';
import { Res } from '../../interfaces/res';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  user: User = {} as User;
  isDropdownOpen: boolean = false;
  isLoggedin: boolean = false;
  isUserDropdownOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isLoginDropdownOpen: boolean = false;
  constructor(
    private authservice: AuthService,
    private manageService: ManageUserService
  ) {
    this.authservice.authChanged$.subscribe((isLoggedIn) => {
      this.isLoggedin = isLoggedIn;
    });
    this.authservice.authChanged$.subscribe((isLoggedIn) => {
      this.isLoggedin = isLoggedIn;
      if (isLoggedIn) {
        this.loadUserDetails();
      }
    });

    this.manageService.currentUser$.subscribe((user) => {
      if (user !== null) {
        this.user = user;
      }
    });
  }

  loadUserDetails(): void {
    this.authservice.getUserDetails().subscribe({
      next: (res: Res) => {
        this.user = res.data;
        this.manageService.setCurrentUser(this.user);
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }
  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  toggleLoginDropdown() {
    this.isLoginDropdownOpen = !this.isLoginDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  logout(): void {
    this.authservice.logout();
  }
}
