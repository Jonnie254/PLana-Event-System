import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../interfaces/ticket';
import { FooterComponent } from '../../all-users/footer/footer.component';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css',
})
export class MyTicketsComponent {
  selectedSection: string = 'upcoming';

  tickets: Ticket[] = [
    {
      ticketNumber: '1234',
      eventName: 'TTNT 5',
      eventLocation: 'Sarit Center',
      eventType: 'Early Bird',
      eventDate: '27 Jul',
      status: 'upcoming',
      canEdit: true,
      canCancel: true,
      canDelete: true,
    },
    {
      ticketNumber: '1234',
      eventName: 'TTNT 5',
      eventLocation: 'Sarit Center',
      eventType: 'Early Bird',
      eventDate: '27 Jul',
      status: 'upcoming',
      canEdit: true,
      canCancel: true,
      canDelete: true,
    },
    {
      ticketNumber: '5678',
      eventName: 'Tech Conference',
      eventLocation: 'Convention Center',
      eventType: 'General Admission',
      eventDate: '12 Aug',
      status: 'past',
      canEdit: false,
      canCancel: false,
      canDelete: true,
    },
    {
      ticketNumber: '9101',
      eventName: 'Music Fest',
      eventLocation: 'Central Park',
      eventType: 'VIP',
      eventDate: '5 Sep',
      status: 'cancelled',
      canEdit: false,
      canCancel: false,
      canDelete: true,
    },
  ];

  selectSection(section: string) {
    this.selectedSection = section;
  }

  getFilteredTickets(): Ticket[] {
    return this.tickets.filter(
      (ticket) => ticket.status === this.selectedSection
    );
  }

  editTicket(ticket: Ticket) {
    // Implement edit logic here
    console.log('Edit ticket:', ticket);
  }

  cancelTicket(ticket: Ticket) {
    // Implement cancel logic here
    console.log('Cancel ticket:', ticket);
  }

  deleteTicket(ticket: Ticket) {
    // Implement delete logic here
    console.log('Delete ticket:', ticket);
  }
}
