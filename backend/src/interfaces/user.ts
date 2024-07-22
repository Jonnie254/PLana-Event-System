import { Booking } from "./Booking";
import { ChatRoom } from "./chats";
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
  profileImage?: string;
}
export interface userUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  password?: string;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  isDeleted: boolean;
  isWelcome: boolean;
  updatedAt: Date;
  events?: Event[];
  bookings?: Booking[];
  roleRequests?: RoleRequest[];
  chatRooms?: ChatRoom[];
}
export interface passwordReset {
  id: string;
  email: string;
  password: string;
}

export interface updateRole {
  request_id: string;
  approve: boolean;
}
