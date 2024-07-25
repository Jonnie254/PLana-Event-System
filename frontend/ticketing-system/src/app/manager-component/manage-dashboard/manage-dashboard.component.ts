import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { BookingData } from '../../interfaces/events';
import { BookingsService } from '../../services/bookings.service';
import { Res } from '../../interfaces/res';
import { AnalyticsService } from '../../services/analytics.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-manage-dashboard',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './manage-dashboard.component.html',
  styleUrl: './manage-dashboard.component.css',
})
export class ManageDashboardComponent {
  Bookings: BookingData[] = [];
  totalBookings: number = 0;
  totalRevenue: number = 0;
  totalEvents: number = 0;
  basicData: any;
  basicOptions: any;
  data: any;
  options: any;
  constructor(
    private bookingService: BookingsService,
    private analyticsService: AnalyticsService,
    private eventService: EventsService
  ) {
    this.getPlannerBookings();
    this.getAllPlannerTotalRevenue();
    this.getAllEventsPlanner();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
  getPlannerBookings() {
    this.bookingService.getBookingsByPlanner().subscribe({
      next: (response: Res) => {
        if (response.success) {
          this.Bookings = response.data;
          this.totalBookings = this.Bookings.length;
        }
      },
      error: () => {
        console.log('Error fetching total revenue');
      },
    });
  }

  getAllPlannerTotalRevenue() {
    this.analyticsService.getPlannerTotalRevenue().subscribe({
      next: (response: Res) => {
        if (response.success) {
          console.log(response.data);
          this.totalRevenue = response.data;
        }
      },
      error: () => {
        console.log('Error fetching total revenue');
      },
    });
  }

  getAllEventsPlanner() {
    this.eventService.getEventsByPlanner().subscribe({
      next: (response: Res) => {
        if (response.success) {
          console.log(response.data);
          this.totalEvents = response.data.length;
        }
      },
      error: () => {
        console.log('Error fetching total revenue');
      },
    });
  }
}
