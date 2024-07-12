import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  selectedEvent: string | null = null;

  events = [
    { name: 'TTNT 5' },
    { name: 'The Big Event' },
    { name: 'TTNT 4' },
    { name: 'TTNT 3' },
    { name: 'Climate Change' },
  ];

  clients = [
    {
      eventName: 'TTNT 5',
      email: 'john@example.com',
      slots: 11,
      ticketType: 'Group',
    },
    {
      eventName: 'The Big Event',
      email: 'jane@example.com',
      slots: 1,
      ticketType: 'Group',
    },
    {
      eventName: 'TTNT 4',
      email: 'alen@example.com',
      slots: 2,
      ticketType: 'Single',
    },
    {
      eventName: 'TTNT 3',
      email: 'kelwin@example.com',
      slots: 1,
      ticketType: 'Single',
    },
    {
      eventName: 'Climate Change',
      email: 'dustin@example.com',
      slots: 1,
      ticketType: 'Group',
    },
  ];

  toggleClientTable(eventName: string) {
    this.selectedEvent = this.selectedEvent === eventName ? null : eventName;
  }

  getClientsForEvent(eventName: string) {
    return this.clients.filter((client) => client.eventName === eventName);
  }
}
