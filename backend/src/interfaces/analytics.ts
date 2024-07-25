export interface BookingAnalytics {
  eventId: string;
  totalBookings: number;
  totalRevenue: number;
  bookings: BookingDetail[];
}

export interface BookingDetail {
  ticketNumber: string;
  eventLocation: string;
  eventDate: Date;
  eventTime?: string;
  eventImage?: string;
  status: string;
}

export interface EventAnalytics {
  eventId: string;
  eventName: string;
  totalTicketsSold: number;
  totalRevenue: number;
  attendance: number;
  date: Date;
}
