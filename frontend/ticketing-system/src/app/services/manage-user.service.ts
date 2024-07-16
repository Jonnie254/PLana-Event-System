import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class ManageUserService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor() {}

  public currentUser$ = this.currentUserSubject.asObservable();
  public setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
