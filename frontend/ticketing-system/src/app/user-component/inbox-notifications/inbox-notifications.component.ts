import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { InboxComponent } from '../../manager-component/inbox/inbox.component';

@Component({
  selector: 'app-inbox-notifications',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, InboxComponent],
  templateUrl: './inbox-notifications.component.html',
  styleUrl: './inbox-notifications.component.css',
})
export class InboxNotificationsComponent {}
