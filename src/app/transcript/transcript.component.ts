import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserState } from '../enums/UserState';
import { Message } from '../models/Message';
import { MessageType } from '../enums/MessageType';
import { WebSocketService } from '../services/web-socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public isChatVisible: boolean = false;
  public user: User;
  public chatMessages: Message[] = [];

  constructor(private userService: UserService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.setupWebSocketOnMessageFunc();
    this.setupUserSubscription();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  private setupWebSocketOnMessageFunc(): void {
    var componentScope = this;
    this.webSocketService.webSocket.onmessage = function(messageEvent) {
      componentScope.populateTranscript(messageEvent);
    }
  }

  private populateTranscript(messageEvent: MessageEvent<any>) {
    if (this.isChatVisible) {
      if (WebSocketService.isAllMessagesResponse(messageEvent.data)) {
        this.chatMessages = (WebSocketService.allMessagesResponseMapping(messageEvent.data));
      } else {
        this.chatMessages.push(WebSocketService.messageMapping(messageEvent.data));
      }
    }
  }

  private setupUserSubscription(): void {
    this.userService.getUserObservable().subscribe((user) => {
      if (user.userState == UserState.IN_CHAT) {
        this.isChatVisible = true;
        this.user = user;
        this.webSocketService.sendMessage(MessageType.ALL_MESSAGES, "");
        this.webSocketService.sendMessage(MessageType.UTILITY, "has joined the chat");
      }
    });
  }

  private scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }
}
