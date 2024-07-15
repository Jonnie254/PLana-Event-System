import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { userRegister } from '../../interfaces/users';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  createAccountMessage: string = '';
  createAccountSuccess: boolean = false;
  createAccountError: boolean = false;
  passwordMatchError: boolean = false;

  registerData: userRegister = {
    first_name: '',
    last_name: '',
    password: '',
    email: '',
    phone: '',
  };
  confirmPassword: string = '';

  constructor(private userService: UserService) {}

  hideMessageAfterTimeout() {
    setTimeout(() => {
      this.createAccountSuccess = false;
      this.createAccountError = false;
      this.createAccountMessage = '';
      this.passwordMatchError = false;
    }, 5000);
  }

  onRegister(registerForm: NgForm) {
    if (this.registerData.password !== this.confirmPassword) {
      this.createAccountMessage = 'Passwords do not match';
      this.passwordMatchError = true;
      this.hideMessageAfterTimeout();
      return;
    }

    if (!registerForm.valid) {
      this.createAccountMessage = 'Please fill in all fields correctly';
      this.createAccountError = true;
      this.hideMessageAfterTimeout();
      return;
    }

    this.userService.registerUser(this.registerData).subscribe(
      (response: Res) => {
        if (response.success) {
          this.createAccountSuccess = true;
          this.createAccountMessage = response.message;
          this.resetForm(registerForm);
        } else {
          this.createAccountError = true;
          this.createAccountMessage = response.message;
        }
        this.hideMessageAfterTimeout();
      },
      (error) => {
        console.error('Registration error:', error);
        this.createAccountError = true;
        this.createAccountMessage = 'An error occurred while registering';
        this.hideMessageAfterTimeout();
      }
    );
  }

  resetForm(registerForm: NgForm) {
    registerForm.resetForm();
  }
}
