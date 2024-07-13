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
  location: string;
  createdById: string;
  groupTickets: GroupTicket[];
  singleTickets: SingleTicket[];
}
