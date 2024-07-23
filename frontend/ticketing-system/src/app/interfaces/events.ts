import { User } from './users';

export interface GroupTicket {
  id: string;
  event: Event;
  slots: number;
  price: number;
  groupSize: number;
}
export interface SingleTicket {
  id: string;
  event: Event;
  slots: number;
  price: number;
}
export interface Event {
  singlePrice: any;
  id: string;
  name: string;
  image: string;
  description: string;
  date: Date;
  eventTime: string;
  location: string;
  createdById: string;
  groupTickets: GroupTicket[];
  singleTickets: SingleTicket[];
  createdAt: Date;
  createdBy: User;
}
export interface GroupTicketMember {
  id: string;
  groupTicketId: string;
  email: string;
}
export interface BookingData {
  eventId: string;
  userId?: string;
  ticketType: 'single' | 'group';
  groupEmails?: string[];
}
export interface Booking {
  id: string;
  ticketNumber: string;
  event: Event;
  user: User;
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
