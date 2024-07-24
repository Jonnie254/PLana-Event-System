import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { userLogin } from '../../interfaces/users';
import { AuthService } from '../../services/auth.service';
import { Res } from '../../interfaces/res';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationsComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  loginData: userLogin = {
    email: '',
    password: '',
  };
  loginSuccess: boolean = false;
  loginError: boolean = false;
  loginMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.loginUser(this.loginData).subscribe(
      (response: Res) => {
        if (response.success) {
          this.loginSuccess = true;
          this.loginMessage = response.message;
          this.resetForm();
        } else {
          this.loginError = true;
          this.loginMessage = response.message;
        }
      },
      (error: any) => {
        console.error('Login error:', error);
        this.loginError = true;
        this.loginMessage =
          error.error?.message || 'An error occurred during login.';
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
