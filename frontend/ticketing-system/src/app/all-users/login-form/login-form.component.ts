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
    // Reset login status
    this.loginSuccess = false;
    this.loginError = false;
    this.loginMessage = '';

    if (!this.loginData.email || !this.loginData.password) {
      // Show error message and return if form fields are empty
      this.loginError = true;
      this.loginMessage = 'Please fill in all fields.';

      setTimeout(() => {
        this.loginError = false;
        this.loginMessage = '';
      }, 5000);

      return;
    }

    // Attempt to login
    this.authService.loginUser(this.loginData).subscribe(
      (response: any) => {
        if (response.success) {
          this.loginSuccess = true;
          this.loginMessage = response.message;
          this.resetForm();

          // Fetch user details to determine role
          this.authService.getUserDetails().subscribe(
            (userResponse: any) => {
              console.log('User details:', userResponse);
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
                  // Handle unknown role or fallback
                  this.router.navigate(['/landing-page']);
                  break;
              }
            },
            (userError: any) => {
              console.error('Error fetching user details:', userError);
              this.router.navigate(['/landing-page']);
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
