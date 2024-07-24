import { Booking } from "./Booking";

export interface GroupTicket {
  id?: string;
  event?: Event;
  groupSize: number;
  slots: number;
  price: number;
}
export interface SingleTicket {
  id?: string;
  event?: Event;
  slots: number;
  price: number;
}
export interface Event {
  id?: string;
  name: string;
  image: string;
  description: string;
  date: String;
  eventTime: string;
  location: string;
  createdById: string;
  groupTickets: GroupTicket[];
  singleTickets: SingleTicket[];
  bookings?: Booking;
}
export interface GroupTicketMember {
  id: string;
  groupTicketId: string;
  email: string;
}
export interface BookingData {
  eventId: string;
  userId: string;
  ticketType: "single" | "group";
  groupEmails?: string[];
}
