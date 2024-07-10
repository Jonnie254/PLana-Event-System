import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { EventsComponent } from './user-component/events/events.component';
import { LoginFormComponent } from './all-users/login-form/login-form.component';
import { EventDashboardComponent } from './manager-component/event-dashboard/event-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    EventsComponent,
    LoginFormComponent,
    EventDashboardComponent,
  ],
})
export class AppComponent {
  title = 'ticketing-system';
  constructor(private router: Router) {
    initFlowbite();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initializeDropdown();
      }
    });
  }
  ngAfterViewInit() {
    this.initializeDropdown();
  }
  private initializeDropdown() {
    // Ensure the dropdown toggle script is executed
    const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
    const dropdownMenu = document.getElementById('dropdownNavbar');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', function () {
        dropdownMenu.classList.toggle('hidden');
      });
    }
  }
}
