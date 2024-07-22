import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../interfaces/events';
import { Res } from '../../interfaces/res';

@Component({
  selector: 'app-manage-all-events',
  standalone: true,
  imports: [],
  templateUrl: './manage-all-events.component.html',
  styleUrl: './manage-all-events.component.css',
})
export class ManageAllEventsComponent {
  events: Event[] = [];

  constructor(private eventService: EventsService) {}
  getAllEvents() {
    this.eventService.getEvents().subscribe({
      next: (response: Res) => {
        this.events = response.data;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
    });
  }
}
