import { Injectable } from '@angular/core';
import { MessageType } from '../enums/MessageType';
import { Message } from '../models/Message';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private static readonly messageComponentSeparator: string = '|';
  private static readonly allMessagesResponseSeperator: string = '~';

  // TODO: public so can apply onMessage function on other class. If able to pass through a setter would be great.
  public webSocket: WebSocket = new WebSocket('wss://localhost:44363/chat');

  constructor(private userService: UserService) { }

  public static isAllMessagesResponse(repsonse: string): boolean {
    return repsonse.indexOf(WebSocketService.allMessagesResponseSeperator) > -1;
  }

  public static isInputValueValid(inputValue: string): boolean {
    return !inputValue.includes(WebSocketService.messageComponentSeparator)
        && !inputValue.includes(WebSocketService.allMessagesResponseSeperator)
        && !this.isJustWhitespace(inputValue);
  }

  public static allMessagesResponseMapping(allMessagesResponse: string): Message[] {
    const messages: Message[] = [];

    const split = allMessagesResponse.split(WebSocketService.allMessagesResponseSeperator);
    split.forEach(message => {
      messages.push(this.messageMapping(message));
    });

    return messages;
  }

  public static messageMapping(message: string): Message {
    const messageComponents = message.split(WebSocketService.messageComponentSeparator, 3);
    return { type: this.getMessageType(messageComponents[0]), sender: messageComponents[1], body: messageComponents[2] };
  }

  private static getMessageType(keyword: string): MessageType {
    if (keyword === 'UTILITY') {
      return MessageType.UTILITY;
    }
    if (keyword === 'ALL_MESSAGES') {
      return MessageType.ALL_MESSAGES;
    }
    if (keyword === 'ASSIGN_USER') {
      return MessageType.ASSIGN_USER;
    }
    if (keyword === 'CLOSE') {
      return MessageType.CLOSE;
    }
    return MessageType.MESSAGE;
  }

  private static isJustWhitespace(message: string): boolean {
    return message.replace(/\s/g, '').length === 0;
  }

  public sendMessage(body: string): void {
    this.webSocket.send(this.generateMessageInAPIFormat(MessageType.MESSAGE, body));
  }

  public sendJoinChatMessage(): void {
    this.webSocket.send(this.generateMessageInAPIFormat(MessageType.UTILITY, 'has joined the chat'));
  }

  public sendCloseMessage(): void {
    this.webSocket.send(this.generateMessageInAPIFormat(MessageType.CLOSE, ''));
  }

  public sendAllMessagesMessage(): void {
    this.webSocket.send(this.generateMessageInAPIFormat(MessageType.ALL_MESSAGES, ''));
  }

  public sendAssignUserMessage(): void {
    this.webSocket.send(this.generateMessageInAPIFormat(MessageType.ASSIGN_USER, ''));
  }

  public closeWebSocket(): void {
    this.webSocket.close();
  }

  private generateMessageInAPIFormat(messageType: MessageType, body: string): string {
    return MessageType[messageType] + WebSocketService.messageComponentSeparator +
      this.userService.getUser().username + WebSocketService.messageComponentSeparator
      + body;
  }
}
