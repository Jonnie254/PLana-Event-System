import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { userLogin } from '../../interfaces/users';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  loginData: any = {
    email: '',
    password: '',
  };
  loginSuccess: boolean = false;
  loginError: boolean = false;
  loginMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Attempt to login
    this.authService.loginUser(this.loginData).subscribe(
      (response: Res) => {
        if (response.success) {
          this.loginSuccess = true;
          this.loginMessage = response.message;
          this.resetForm();
          localStorage.setItem('token', response.data);
          console.log(response);
          localStorage.setItem('role', response.data.role);
          this.authService.checkAuthStatus();
          this.authService.isAuthenticatedSubject.next(true);

          // Fetch user details to determine role
          this.authService.getUserDetails().subscribe(
            (userResponse: any) => {
              // Set a timeout before redirecting
              setTimeout(() => {
                switch (userResponse.data.role) {
                  case 'admin':
                    this.router.navigate(['/admin']);
                    break;
                  case 'planner':
                    this.router.navigate(['/event-dashboard']);
                    break;
                  case 'user':
                    this.router.navigate(['/all-events']);
                    break;
                  default:
                    this.router.navigate(['/landing-page']);
                    break;
                }
              }, 3000); // 3 seconds delay before redirecting
            },
            (userError: any) => {
              console.error('Error fetching user details:', userError);
              setTimeout(() => {
                this.router.navigate(['/landing-page']);
              }, 3000); // 3 seconds delay before redirecting
            }
          );
        } else {
          this.loginError = true;
          this.loginMessage = response.message;
        }
      },
      (error: any) => {
        console.error('Login error:', error);
        this.loginError = true;
        if (error.error && error.error.message) {
          this.loginMessage = error.error.message;
        } else {
          this.loginMessage = 'An error occurred during login.';
        }
      }
    );

    // Automatically hide the messages after a timeout
    setTimeout(() => {
      this.loginSuccess = false;
      this.loginError = false;
      this.loginMessage = '';
    }, 5000);
  }

  resetForm() {
    this.loginData = {
      email: '',
      password: '',
    };
  }
}
