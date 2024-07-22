import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Booking } from '../../interfaces/events';
import { BookingsService } from '../../services/bookings.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  selectedEvent: string | null = null;
  bookings: Booking[] = [];
  events: { name: string }[] = [];

  constructor(private bookingService: BookingsService) {}

  ngOnInit() {
    this.getAllBookings();
  }

  getAllBookings() {
    this.bookingService.getBookingsByPlanner().subscribe((res) => {
      this.bookings = res.data;
      this.events = this.getUniqueEvents();
    });
  }

  getUniqueEvents(): { name: string }[] {
    const uniqueEventNames = [
      ...new Set(this.bookings.map((booking) => booking.event.name)),
    ];
    return uniqueEventNames.map((name) => ({ name }));
  }

  toggleUserTable(eventName: string) {
    this.selectedEvent = this.selectedEvent === eventName ? null : eventName;
  }

  getUsersForEvent(eventName: string) {
    return this.bookings
      .filter((booking) => booking.event.name === eventName)
      .map((booking) => ({
        eventName: booking.event.name,
        email: booking.user.email,
        slots:
          booking.ticketType === 'single'
            ? booking.event.singleTickets
            : booking.event.groupTickets,
        ticketType: booking.ticketType,
      }));
  }
}
