import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingData, Event } from '../../interfaces/events';
import { EventsService } from '../../services/events.service';
import { CommonModule } from '@angular/common';
import { BookingsService } from '../../services/bookings.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotificationsComponent } from '../../all-users/notifications/notifications.component';

@Component({
  selector: 'app-single-event',
  standalone: true,
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css'],
  imports: [
    NavbarComponent,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    NotificationsComponent,
  ],
})
export class SingleEventComponent {
  event: Event = {} as Event;
  events: Event[] = [];
  bookingForm: FormGroup;
  confirmationModal: boolean = false;
  showNotification: boolean = false;
  notificationType: 'success' | 'error' = 'success';
  notificationMessage: string = '';

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private bookingService: BookingsService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      ticketType: ['', Validators.required],
      groupEmails: this.fb.array([]),
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getSingleEvent(id);
      }
    });
    this.upcomingEvents();
    this.bookingForm.get('ticketType')?.valueChanges.subscribe((value) => {
      if (value === 'group') {
        this.addGroupEmailFields();
      } else {
        this.clearGroupEmailFields();
      }
    });
  }

  get groupEmails() {
    return this.bookingForm.get('groupEmails') as FormArray;
  }

  addGroupEmailFields() {
    const groupSize = this.event.groupTickets?.[0]?.groupSize || 0;
    this.clearGroupEmailFields();
    for (let i = 0; i < groupSize - 1; i++) {
      this.groupEmails.push(
        this.fb.control('', [Validators.required, Validators.email])
      );
    }
  }

  clearGroupEmailFields() {
    while (this.groupEmails.length !== 0) {
      this.groupEmails.removeAt(0);
    }
  }

  upcomingEvents() {
    this.eventsService.getUpcomngEvents().subscribe((res) => {
      this.events = res.data;
    });
  }

  getSingleEvent(id: string): void {
    this.eventsService.getSingleEvent(id).subscribe((res) => {
      this.event = res.data;
    });
  }

  getSelectedTicketPrice(): number {
    const ticketType = this.bookingForm.get('ticketType')?.value;
    if (ticketType === 'single') {
      return this.event.singleTickets?.[0]?.price || 0;
    } else if (ticketType === 'group') {
      return this.event.groupTickets?.[0]?.price || 0;
    }
    return 0;
  }
  hideNotification() {
    this.showNotification = false;
  }
  showNotificationWithTimeout(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }
  showModal() {
    if (this.bookingForm.valid) {
      this.confirmationModal = true;
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  }

  closeModal() {
    this.confirmationModal = false;
  }

  purchaseTicket() {
    if (this.bookingForm.invalid) {
      return;
    }

    const bookingData: BookingData = {
      eventId: this.event.id,
      ticketType: this.bookingForm.get('ticketType')?.value,
      groupEmails:
        this.bookingForm.get('ticketType')?.value === 'group'
          ? this.groupEmails.value
          : undefined,
    };

    this.bookingService.makeBooking(bookingData).subscribe(
      (res) => {
        if (res.success) {
          this.showNotificationWithTimeout(res.message, 'success');
          this.closeModal();
        } else {
          this.showNotificationWithTimeout(
            `Booking failed: ${res.message}`,
            'error'
          );
        }
      },
      (error) => {
        console.error('Booking error:', error);
        if (error.error && error.error.message) {
          this.showNotificationWithTimeout(error.error.message, 'error');
        } else {
          this.showNotificationWithTimeout(
            'An error occurred while booking your ticket. Please try again later.',
            'error'
          );
        }
        this.closeModal();
      }
    );
  }
}
