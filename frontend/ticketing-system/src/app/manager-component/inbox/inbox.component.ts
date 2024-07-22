import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatRoom } from '../../interfaces/chatmessage';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit, OnDestroy {
  chatRooms: ChatRoom[] = [];
  messages: ChatMessage[] = [];
  selectedChatRoom: ChatRoom | null = null;
  newMessage = '';
  private messageSubscription: Subscription | undefined;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {
    this.getUserChatRooms();
  }

  ngOnInit() {
    this.messageSubscription = this.chatService.getMessages().subscribe({
      next: (message: ChatMessage) => {
        if (
          this.selectedChatRoom &&
          message.chatRoomId === this.selectedChatRoom.id
        ) {
          this.messages.push(message);
          this.scrollToBottom();
          this.cdRef.detectChanges(); // Manually trigger change detection
        }
      },
      error: (err) => console.error('Error receiving messages:', err),
    });

    this.getUserChatRooms();
  }

  getUserChatRooms() {
    this.userService.getChatRooms().subscribe({
      next: (res: Res) => {
        this.chatRooms = res.data;

        this.chatRooms.forEach((chatRoom) => {
          chatRoom.messages.forEach((message) => {
            const user = chatRoom.users.find(
              (user) => user.id === message.senderId
            );
            if (user) {
              message.sender = user;
            }
          });
        });

        this.cdRef.detectChanges(); // Ensure change detection runs after data is fetched
      },
      error: (err) => console.error('Error receiving chat rooms:', err),
    });
  }

  selectChatRoom(chatRoom: ChatRoom) {
    if (this.selectedChatRoom) {
      this.chatService.leaveRoom(this.selectedChatRoom.id);
    }

    this.selectedChatRoom = chatRoom;
    this.messages = chatRoom.messages;
    this.chatService.joinRoom(chatRoom.id);

    this.scrollToBottom();
    this.cdRef.detectChanges(); // Manually trigger change detection
  }

  sendMessage() {
    if (this.newMessage.trim() !== '' && this.selectedChatRoom) {
      this.chatService.sendMessage(this.newMessage, this.selectedChatRoom.id);
      this.newMessage = '';
      this.cdRef.detectChanges(); // Manually trigger change detection
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
      this.cdRef.detectChanges(); // Ensure the changes are reflected
    }, 0);
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    if (this.selectedChatRoom) {
      this.chatService.leaveRoom(this.selectedChatRoom.id);
    }
  }
}
