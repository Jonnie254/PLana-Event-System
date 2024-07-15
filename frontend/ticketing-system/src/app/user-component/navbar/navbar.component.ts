import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isDropdownOpen: boolean = false;
  isLoggedin: boolean = false;
  isUserDropdownOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isLoginDropdownOpen: boolean = false;
  constructor(private authservice: AuthService) {
    this.authservice.authChanged$.subscribe((isLoggedIn) => {
      this.isLoggedin = isLoggedIn;
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
