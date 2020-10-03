import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserState } from '../enums/UserState';

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.scss']
})
export class ConnectFormComponent {
  public username: string;
  public isUsernameSet: boolean = false;

  constructor(private userService: UserService) { }

  onSubmit(): void {
    this.userService.setAndBroadcastUser({ username: this.username, userState: UserState.IN_CHAT});
    this.isUsernameSet = true;
  }
}
