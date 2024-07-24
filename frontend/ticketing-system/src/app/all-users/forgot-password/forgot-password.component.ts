import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { passwordReset } from '../../interfaces/users';
import { Res } from '../../interfaces/res';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  passwordResetData: passwordReset = {
    email: '',
    resetCode: '',
    newPassword: '',
  };
  showResetFields: boolean = false;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private userService: UserService, private router: Router) {}

  requestPasswordReset() {
    if (this.passwordResetData.email) {
      this.userService
        .requestPasswordReset(this.passwordResetData.email)
        .subscribe({
          next: (response: Res) => {
            this.showNotification = true;
            this.notificationMessage = response.message;
            this.notificationType = response.success ? 'success' : 'error';

            if (response.success) {
              this.showResetFields = true;
            }

            // Clear notification after 3 seconds
            setTimeout(() => this.closeNotification(), 3000);
          },
          error: (error) => {
            this.showNotification = true;
            this.notificationMessage =
              error.error?.message ||
              'An error occurred while resetting the password.';
            this.notificationType = 'error';

            // Clear notification after 3 seconds
            setTimeout(() => this.closeNotification(), 3000);
          },
        });
    }
  }

  resetPassword() {
    if (
      this.passwordResetData.resetCode &&
      this.passwordResetData.newPassword
    ) {
      this.userService.resetPassword(this.passwordResetData).subscribe({
        next: (response: Res) => {
          this.showNotification = true;
          this.notificationMessage = response.message;
          this.notificationType = response.success ? 'success' : 'error';

          if (response.success) {
            // Redirect to login page after 3 seconds
            setTimeout(() => {
              this.closeNotification();
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            // Clear notification after 3 seconds
            setTimeout(() => this.closeNotification(), 3000);
          }
        },
        error: (error) => {
          this.showNotification = true;
          this.notificationMessage =
            error.error?.message ||
            'An error occurred while resetting the password.';
          this.notificationType = 'error';
          setTimeout(() => this.closeNotification(), 3000);
        },
      });
    }
  }

  closeNotification() {
    this.showNotification = false;
    this.notificationMessage = '';
  }
}
