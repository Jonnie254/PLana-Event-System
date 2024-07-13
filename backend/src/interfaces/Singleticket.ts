export interface SingleTicket {
  id: string;
  event: Event;
  slots: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
