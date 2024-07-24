import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Observable, of } from 'rxjs';
import { Res } from '../../interfaces/res';
import { EventPromotion } from '../../interfaces/events';

@Component({
  selector: 'app-manage-all-promotions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-all-promotions.component.html',
  styleUrls: ['./manage-all-promotions.component.css'],
})
export class ManageAllPromotionsComponent {
  paginatedEvents: EventPromotion[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  selectedEvent: Event | null = null;
  totalPromotions = 0;
  confirmationModal: boolean = false;
  requestedPromotionId: string = '';

  constructor(private eventService: EventsService) {
    this.loadPromotions();
  }

  loadPromotions() {
    this.eventService.getEventPromotions().subscribe({
      next: (response) => {
        if (response.success) {
          this.totalPromotions = response.data.length;
          this.updatePaginatedEvents(response.data);
          console.log('Promotions:', response.data);
        } else {
          // Handle error
        }
      },
      error: (err) => {
        // Handle error
      },
    });
  }

  updatePaginatedEvents(promotions: EventPromotion[]) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEvents = promotions.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPromotions();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPromotions();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadPromotions();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalPromotions / this.itemsPerPage);
  }

  approvePromotion(requestedPromotionId: string) {
    this.eventService.approveEventPromotion(requestedPromotionId).subscribe({
      next: (response: Res) => {
        if (response.success) {
          console.log('Promotion successfully updated:', response.data);
        } else {
          console.log('Promotion not successfully updated:', response.message);
        }
      },
    });
    // Logic to approve promotion
  }

  rejectPromotion(requestedPromotionId: string) {
    // Logic to reject promotion
  }
  closeModal() {
    this.confirmationModal = false;
  }
  showConfirmationModal(requestedPromotionId: string) {
    this.requestedPromotionId = requestedPromotionId;
    this.confirmationModal = true;
  }
}
