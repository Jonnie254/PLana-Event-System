import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProfileComponent } from '../profile/profile.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-nav',
  standalone: true,
  imports: [NavbarComponent, ProfileComponent, RouterOutlet],
  templateUrl: './profile-nav.component.html',
  styleUrl: './profile-nav.component.css',
})
export class ProfileNavComponent {}
