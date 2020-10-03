import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserState } from '../enums/UserState';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {
  public isChatVisible: boolean = false;
  public currentChatValue: string;
  public chatMessages: string[] = []; 
  private webSocket: WebSocket;

  constructor(private userService: UserService) {
    this.userService.getUserObservable().subscribe((user) => {
      if (user.userState == UserState.IN_CHAT) {
        this.isChatVisible = true;
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
        componentScope.chatMessages.push(messageEvent.data);
      }
    }
  }

  private generateMessageInAPIFormat(): string {
    let messageSplitSymbol = '|';
    return this.userService.getUser().username + messageSplitSymbol + this.currentChatValue;
  }
}
