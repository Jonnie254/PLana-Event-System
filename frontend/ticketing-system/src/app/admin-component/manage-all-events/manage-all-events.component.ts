import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../interfaces/events';
import { Res } from '../../interfaces/res';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-all-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-all-events.component.html',
  styleUrls: ['./manage-all-events.component.css'],
})
export class ManageAllEventsComponent implements OnInit {
  events: Event[] = [];
  paginatedEvents: Event[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  selectedEvent: Event | null = null;

  constructor(private eventService: EventsService) {}

  ngOnInit() {
    this.getAllEventsWithOrganizers();
  }

  getAllEventsWithOrganizers() {
    this.eventService.getEventsWithOrganizers().subscribe({
      next: (response: Res) => {
        this.events = response.data;
        this.paginateEvents();
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
    });
  }

  paginateEvents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginateEvents();
  }

  goToNextPage() {
    if (this.currentPage * this.itemsPerPage < this.events.length) {
      this.currentPage++;
      this.paginateEvents();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateEvents();
    }
  }

  totalPages(): number {
    return Math.ceil(this.events.length / this.itemsPerPage);
  }

  showEventDetails(event: Event) {
    this.selectedEvent = event;
  }

  closeEventDetails() {
    this.selectedEvent = null;
  }
}
