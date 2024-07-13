import { Booking } from "./Booking";
import { RoleRequest } from "./RoleRequest";

export interface userLogins {
  email: string;
  password: string;
}
export interface userRegister {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone: string;
}
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  isDeleted: boolean;
  isWelcome: boolean;
  updatedAt: Date;
  events?: Event[];
  bookings?: Booking[];
  roleRequests?: RoleRequest[];
}
