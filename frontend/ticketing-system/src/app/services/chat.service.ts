import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatMessage } from '../interfaces/chatmessage';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private currentChatRoomId: string | null = null;

  constructor() {
    const token = localStorage.getItem('token');
    this.socket = io('http://localhost:3005', {
      auth: {
        token: token,
      },
    });
  }

  joinRoom(chatRoomId: string) {
    if (this.currentChatRoomId) {
      this.leaveRoom(this.currentChatRoomId);
    }
    this.currentChatRoomId = chatRoomId;
    this.socket.emit('joinChatRoom', chatRoomId);
  }

  leaveRoom(chatRoomId: string) {
    this.socket.emit('leaveChatRoom', chatRoomId);
    this.currentChatRoomId = null;
  }

  sendMessage(message: string, chatRoomId: string) {
    if (chatRoomId) {
      this.socket.emit('chatMessage', {
        message,
        chatRoomId,
      });
    }
  }

  getMessages(): Observable<ChatMessage> {
    return new Observable<ChatMessage>((observer) => {
      this.socket.on('newChatMessage', (message: ChatMessage) => {
        observer.next(message);
      });
    });
  }
}
