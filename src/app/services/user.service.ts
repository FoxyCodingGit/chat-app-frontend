import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;
  private userSubject = new Subject<User>();

  public getUserObservable(): Observable<User> {
    return this.userSubject.asObservable();
  }

  public getUser(): User {
    return this.user;
  }

  public setAndBroadcastUser(user: User): void {
    this.user = user;
    this.userSubject.next(user);
  }

  constructor() { }
}
