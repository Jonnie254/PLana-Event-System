import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userLogin } from '../interfaces/users';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Res } from '../interfaces/res';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3005';
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  redirectUrl: string | null = null;
  private userIdSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      // Fetch user details and extract user ID
      this.getUserDetails().subscribe({
        next: (res) => {
          if (res.success && res.data && res.data.id) {
            this.userIdSubject.next(res.data.id);
          } else {
            this.userIdSubject.next(null);
          }
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.userIdSubject.next(null);
        },
      });
    }
  }

  get authChanged$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  get userId$(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  loginUser(userLogin: userLogin): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/auth/login`, userLogin).pipe(
      tap((res) => {
        if (res.success) {
          localStorage.setItem('token', res.data);
          this.checkAuthStatus();
          this.isAuthenticatedSubject.next(true);

          this.getUserDetails().subscribe(
            (userResponse: Res) => {
              this.redirectBasedOnRole(userResponse.data.role);
            },
            (userError: Res) => {
              console.error('Error fetching user details:', userError);
              this.router.navigate(['/landing-page']);
            }
          );
        }
      })
    );
  }

  getUserDetails(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/getUserById`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  redirectBasedOnRole(role: string) {
    let redirectUrl = '/';
    switch (role) {
      case 'admin':
        redirectUrl = '/admin-dashboard';
        break;
      case 'Event Planner':
        redirectUrl = '/event-dashboard';
        break;
      case 'user':
        redirectUrl = '/all-events';
        break;
      default:
        redirectUrl = '/landing-page';
        break;
    }

    const finalRedirectUrl = this.redirectUrl || redirectUrl;
    this.redirectUrl = null;

    this.router.navigate([finalRedirectUrl]);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/landing-page']);
  }

  handleTokenExpired(): void {
    this.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
}
