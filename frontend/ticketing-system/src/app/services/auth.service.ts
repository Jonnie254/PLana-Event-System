import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userLogin } from '../interfaces/users';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Res } from '../interfaces/res';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3005';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  // Method to check and update authentication status
  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Observable to subscribe to authentication changes
  get authChanged$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  loginUser(userLogin: userLogin): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/auth/login`, userLogin).pipe(
      tap((res: Res) => {
        if (res.success) {
          localStorage.setItem('token', res.data);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  getUserDetails(): Observable<Res> {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    return this.http.get<Res>(`${this.baseUrl}/user/getUserById`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Method to perform logout
  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false); // Update authentication status
  }

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
