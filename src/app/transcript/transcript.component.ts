import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserState } from '../enums/UserState';
import { Message } from '../models/Message';
import { MessageType } from '../enums/MessageType';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {
  public isChatVisible: boolean = false;
  public currentChatValue: string;
  public chatMessages: Message[] = []; 
  private webSocket: WebSocket;

  constructor(private userService: UserService) {
    this.userService.getUserObservable().subscribe((user) => {
      if (user.userState == UserState.IN_CHAT) {
        this.isChatVisible = true;
        this.webSocket.send('UTILITY|' + user.username + "|" + "has joined the chat");
      }
    });
  }

  ngOnInit(): void {
    this.setupWebsocket();
  }
  
  public onSubmit(): void {
    this.webSocket.send(this.generateMessageInAPIFormat());
    this.currentChatValue = "";
  }

  private setupWebsocket(): void {
    this.webSocket = new WebSocket('wss://localhost:44363/chat');

    var componentScope = this;
    this.webSocket.onmessage = function(messageEvent) {
      if (componentScope.isChatVisible) {
        componentScope.chatMessages.push(componentScope.messageMapping(messageEvent.data));
      }
    }
  }

  private messageMapping(message: string): Message {
    let messageComponents = message.split('|', 3);
    return { type: this.getMessageType(messageComponents[0]), sender: messageComponents[1], body: messageComponents[2] };
  }

  private generateMessageInAPIFormat(): string {
    let messageSplitSymbol = '|';
    return 'MESSAGE' + messageSplitSymbol + this.userService.getUser().username + messageSplitSymbol + this.currentChatValue;
  }

  private getMessageType(keyword: string): MessageType {
    if (keyword == 'UTILITY') {
      return MessageType.UTILITY;
    }
    return MessageType.MESSAGE;
  }
}
