import { Component } from '@angular/core';
import { MessageType } from '../enums/MessageType';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {  
  public chatInputValue: string;

  constructor(private webSocketService: WebSocketService) { }
  
  public onSubmit(): void {
    this.webSocketService.sendMessage(MessageType.MESSAGE, this.chatInputValue);
    this.chatInputValue = "";
  }
}
