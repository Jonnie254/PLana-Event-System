import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userRegister } from '../interfaces/users';
import { Observable } from 'rxjs';
import { Res } from '../interfaces/res';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'http://localhost:3005';
  constructor(private http: HttpClient) {}

  // Register User
  registerUser(user: userRegister): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/user/registerUser`, user);
  }
}