// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      this.authService.userId$.subscribe((userId) => {
        if (userId) {
          this.authService.getUserDetails().subscribe((res) => {
            if (res.success && res.data) {
              const userRole = res.data.role;
              if (userRole === 'admin' || userRole === 'Event Planner') {
                observer.next(true);
              } else {
                this.router.navigate(['/landing-pge']);
                observer.next(false);
              }
            } else {
              this.router.navigate(['/login']);
              observer.next(false);
            }
          });
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
        }
      });
    });
  }
}
