import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userLogin } from '../interfaces/users';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Res } from '../interfaces/res';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3005';
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  get authChanged$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  loginUser(userLogin: userLogin): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/auth/login`, userLogin);
  }

  getUserDetails(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/getUserById`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/landing-page']);
  }
  handleTokenExpired(): void {
    this.logout();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
