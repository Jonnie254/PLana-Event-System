export interface Booking {
  id: string;
  ticketNumber: string;
  event: Event;
  userId: string;
  ticketType: string;
  eventLocation: string;
  eventDate: Date;
  eventTime?: string | null;
  eventImage?: string | null;
  status: string;
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
