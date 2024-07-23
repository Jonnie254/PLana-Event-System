import { ChatMessage } from './chatmessage';

export interface Users {
  id: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
}
export interface userRegister {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone: string;
  profileImage?: string;
}
export interface userLogin {
  email: string;
  password: string;
}
export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  isDeleted: boolean;
  isWelcome: boolean;
  updatedAt: Date;
  chatMessages: ChatMessage[];
}

export interface Role {
  id: string;
  approved: boolean;
  userId: string;
  user: User;
}
