import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Event, EventPromotion } from '../../interfaces/events';
import { EventsService } from '../../services/events.service';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../pipes/search.pipe';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [NavbarComponent, CommonModule, RouterLink, FormsModule, SearchPipe],
})
export class EventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  promotions: EventPromotion[] = [];
  currentIndex = 0;
  currentPromotion: EventPromotion | null = null;
  private intervalId: any;
  searchTerm: string = '';

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllEvents();
    this.getAllApprovedPromotions();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getSingleEvent(id);
      }
    });
    this.startSlideshow();
  }

  ngOnDestroy() {
    this.stopSlideshow();
  }

  getSingleEvent(id: string): void {
    this.eventsService.getSingleEvent(id).subscribe((res) => {
      this.router.navigate(['/single-event', res.data.id]);
    });
  }

  getAllEvents(): void {
    this.eventsService.getEvents().subscribe((res) => {
      this.events = res.data;
    });
  }

  getAllApprovedPromotions(): void {
    this.eventsService.getAvailablePromotion().subscribe((res) => {
      this.promotions = res.data;
      if (this.promotions.length > 0) {
        this.currentPromotion = this.promotions[0];
      }
    });
  }

  startSlideshow() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopSlideshow() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.promotions.length;
    this.updateCurrentPromotion();
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.promotions.length) % this.promotions.length;
    this.updateCurrentPromotion();
  }

  private updateCurrentPromotion() {
    this.currentPromotion = this.promotions[this.currentIndex];
  }
}
