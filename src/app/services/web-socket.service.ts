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
  private static readonly messageComponentSeparator: string = '|';
  private static readonly allMessagesResponseSeperator: string = '~';

  constructor(private userService: UserService) { }

  public static isAllMessagesResponse(repsonse: string): boolean {
    return repsonse.indexOf(WebSocketService.allMessagesResponseSeperator) > -1;
  }

  public static allMessagesResponseMapping(allMessagesResponse: string): Message[] {
    let messages: Message[] = []; 

    let split = allMessagesResponse.split(WebSocketService.allMessagesResponseSeperator);
    split.forEach(message => {
      messages.push(this.messageMapping(message));
    });

    return messages;
  }

  public static messageMapping(message: string): Message {
    let messageComponents = message.split(WebSocketService.messageComponentSeparator, 3);
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
    return MessageType[messageType] + WebSocketService.messageComponentSeparator +
      this.userService.getUser().username + WebSocketService.messageComponentSeparator
      + body;
  }
}
