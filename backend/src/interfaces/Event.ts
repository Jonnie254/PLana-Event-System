export interface GroupTicket {
  id: string;
  event: Event;
  slots: number;
  price: number;
}
export interface SingleTicket {
  id: string;
  event: Event;
  slots: number;
  price: number;
}
export interface Event {
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
}
export interface BookingData {
  eventId: string;
  userId: string;
  ticketType: "single" | "group";
  slots: number;
}
