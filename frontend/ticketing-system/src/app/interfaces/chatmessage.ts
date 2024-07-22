import { Event } from './events';
import { User } from './users';

export interface ChatMessage {
  id: string;
  senderId: string;
  chatRoomId: string;
  message: string;
  createdAt: string;
  sender?: User;
}

export interface ChatRoom {
  id: string;
  eventId: string;
  event: Event;
  users: User[];
  messages: ChatMessage[];
  latestMessage?: ChatMessage;
}

export interface ChatRoomUser {
  chatRoomId: string;
  userId: string;
  chatRoom: ChatRoom;
  user: User;
}
