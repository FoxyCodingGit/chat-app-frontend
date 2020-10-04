import { Injectable } from '@angular/core';
import { MessageType } from '../enums/MessageType';
import { Message } from '../models/Message';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // TODO: public so can apply onMessage function on other class. If able to pass through a setter would be great.
  public webSocket: WebSocket = new WebSocket('wss://localhost:44363/chat');

  constructor(private userService: UserService) { }

  public static messageMapping(message: string): Message {
    let messageComponents = message.split('|', 3);
    return { type: this.getMessageType(messageComponents[0]), sender: messageComponents[1], body: messageComponents[2] };
  }

  public sendMessage(messageType: MessageType, body: string) {
    this.webSocket.send(this.generateMessageInAPIFormat(messageType, body));
  }

  private static getMessageType(keyword: string): MessageType {
    if (keyword == 'UTILITY') {
      return MessageType.UTILITY;
    }
    return MessageType.MESSAGE;
  }

  private generateMessageInAPIFormat(messageType: MessageType, body: string): string {
    let messageSplitSymbol = '|';
    return MessageType[messageType] + messageSplitSymbol + this.userService.getUser().username + messageSplitSymbol + body;
  }
}
