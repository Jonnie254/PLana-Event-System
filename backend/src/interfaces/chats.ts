import { User } from "./user";

export interface ChatMessage {
  id: string;
  senderId: string;
  sender: User;
  chatRoomId: string;
  chatRoom: ChatRoom;
  message: string;
}

export interface ChatRoom {
  id: string;
  eventId: string;
  event: Event;
  users: User[];
  messages: ChatMessage[];
}

export interface ChatRoomUser {
  chatRoomId: string;
  userId: string;
  chatRoom: ChatRoom;
  user: User;
}
