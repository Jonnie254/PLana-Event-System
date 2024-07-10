export interface Ticket {
  ticketNumber: string;
  eventName: string;
  eventLocation: string;
  eventType: string;
  eventDate: string;
  eventTime?: string;
  eventImage?: string;
  status?: string;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
}
