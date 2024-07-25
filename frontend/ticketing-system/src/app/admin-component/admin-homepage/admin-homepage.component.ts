import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { Booking } from '../../interfaces/events';
import { AnalyticsService } from '../../services/analytics.service';
import { Res } from '../../interfaces/res';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChartModule],
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.css'],
})
export class AdminHomepageComponent implements OnInit {
  Bookings: Booking[] = [];
  totalBookings: number = 0;
  totalRevenue: number = 0;
  totalEvents: number = 0;

  revenueData: any;
  revenueOptions: any;
  bookingsByEventData: any;
  bookingsByEventOptions: any;
  bookingStatusData: any;
  bookingStatusOptions: any;

  constructor(
    private analyticsService: AnalyticsService,
    private eventService: EventsService
  ) {
    this.getAllBookingsAdmin();
    this.getAdminTotalRevenue();
    this.getAllEvents();
    this.initializeCharts();
  }

  ngOnInit(): void {}

  initializeCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.revenueOptions = {
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

    this.bookingsByEventOptions = {
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

    this.bookingStatusOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }

  getAllEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response: Res) => {
        if (response.success) {
          this.totalEvents = response.data.length;
          console.log('Events:', response.data);
        }
      },
      error: () => {
        console.log('Error fetching events');
      },
    });
  }

  getAdminTotalRevenue(): void {
    this.analyticsService.getAdminTotalRevenue().subscribe({
      next: (response: Res) => {
        if (response.success) {
          this.totalRevenue = response.data;
          console.log('Total Revenue:', response.data);
        }
      },
      error: () => {
        console.log('Error fetching total revenue');
      },
    });
  }

  getAllBookingsAdmin(): void {
    this.analyticsService.getAllBookings().subscribe({
      next: (response: Res) => {
        if (response.success) {
          this.Bookings = response.data;
          this.totalBookings = this.Bookings.length;
          console.log('Bookings:', response.data);

          this.updateRevenueData();
          this.updateBookingsByEventData();
        }
      },
      error: () => {
        console.log('Error fetching bookings');
      },
    });
  }

  updateRevenueData(): void {
    // Example of monthly revenue data (could be dynamically calculated)
    const monthlyRevenue = this.calculateMonthlyRevenue();

    this.revenueData = {
      labels: monthlyRevenue.labels,
      datasets: [
        {
          label: 'Monthly Revenue',
          data: monthlyRevenue.values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    };
  }

  updateBookingsByEventData(): void {
    const eventBookingCounts = this.Bookings.reduce((acc, booking) => {
      acc[booking.event.name] = (acc[booking.event.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.bookingsByEventData = {
      labels: Object.keys(eventBookingCounts),
      datasets: [
        {
          label: 'Bookings by Event',
          data: Object.values(eventBookingCounts),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1,
        },
      ],
    };
  }

  // Example function to calculate monthly revenue
  calculateMonthlyRevenue(): { labels: string[]; values: number[] } {
    // Replace with actual revenue calculation logic
    return {
      labels: ['January', 'February', 'March', 'April'],
      values: [2000, 1500, 3000, 2500],
    };
  }
}
