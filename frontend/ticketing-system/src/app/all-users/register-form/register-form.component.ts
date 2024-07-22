import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { userRegister } from '../../interfaces/users';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  showNotification: boolean = false;
  notificationType: 'success' | 'error' = 'success';
  notificationMessage: string = '';
  //check if the password and confirm password match

  registerData: userRegister = {
    first_name: '',
    last_name: '',
    password: '',
    email: '',
    phone: '',
  };
  confirmPassword: string = '';

  constructor(private userService: UserService, private router: Router) {}
  hideNotification() {
    this.showNotification = false;
  }
  showNotificationWithTimeout(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  onRegister(registerForm: NgForm) {
    if (this.registerData.password !== this.confirmPassword) {
      this.showNotificationWithTimeout('Passwords do not match', 'error');
      return;
    }

    if (!registerForm.valid) {
      this.showNotificationWithTimeout(
        'Please fill in all fields correctly',
        'error'
      );
      return;
    }

    this.userService.registerUser(this.registerData).subscribe(
      (response: Res) => {
        if (response.success) {
          this.showNotificationWithTimeout(response.message, 'success');
          this.resetForm(registerForm);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.showNotificationWithTimeout(response.message, 'error');
        }
      },
      (error) => {
        console.error('Registration error:', error);
        this.showNotificationWithTimeout(
          'An error occurred while registering',
          'error'
        );
      }
    );
  }

  resetForm(registerForm: NgForm) {
    registerForm.resetForm();
  }
}
