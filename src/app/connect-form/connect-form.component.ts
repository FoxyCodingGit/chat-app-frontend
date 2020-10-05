import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserState } from '../enums/UserState';
import { WebSocketService } from '../services/web-socket.service';
import { MessageType } from '../enums/MessageType';

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.scss']
})
export class ConnectFormComponent {
  public username: string;
  public isUsernameSet = false;
  public isUsernameValid = false;
  private sentAssignUser = false;

  constructor(private userService: UserService, private webSocketService: WebSocketService) { }

  onSubmit(): void {
    this.userService.setAndBroadcastUser({ username: this.username, userState: UserState.IN_CHAT});
    this.isUsernameSet = true;

    if (!this.sentAssignUser) {
      this.webSocketService.sendMessage(MessageType.ASSIGN_USER, '');
      this.sentAssignUser = true;
    }
  }

  public onChange(value: string): void {
    this.isUsernameValid = WebSocketService.isInputValueValid(value);
  }
}
