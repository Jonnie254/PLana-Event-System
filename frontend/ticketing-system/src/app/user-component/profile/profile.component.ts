import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '../../interfaces/users';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  Form,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';
import { ManageUserService } from '../../services/manage-user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user: User = {} as User;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  buttonText: string = 'Edit';
  spinnerVisible: boolean = false;
  loginSuccess: boolean = false;
  loginError: boolean = false;
  loginMessage: string = '';
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private manageUserService: ManageUserService
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: [''],
      profileImage: [''],
    });

    this.manageUserService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.updateForm.patchValue({
          firstName: this.user.firstname,
          lastName: this.user.lastname,
          email: this.user.email,
          phone: this.user.phone,
          profileImage: this.user.profileImage,
        });
      }
    });
  }

  get f() {
    return this.updateForm.controls;
  }
  imageurl: string = '';
  getImagesUrl(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'tours_travel');
      formData.append('cloud_name', 'do9a5sjgi');
      this.imageurl = '';
      this.showSpinner();

      fetch('https://api.cloudinary.com/v1_1/do9a5sjgi/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          this.imageurl = result.url;
          this.updateForm.patchValue({ profileImage: this.imageurl });
          setTimeout(() => {
            this.hideSpinner();
          }, 2000);
        })
        .catch((error) => {
          console.error('Error:', error);
          this.hideSpinner();
        });
    }
  }
  showSpinner() {
    this.spinnerVisible = true;
  }

  hideSpinner() {
    this.spinnerVisible = false;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.buttonText = this.isEditMode ? 'Save' : 'Edit';
  }
  onFileSelected(event: any) {
    if (this.isEditMode) {
      this.selectedFile = event.target.files[0];
    }
  }
  onSave() {
    if (this.updateForm.invalid) {
      return;
    }
    const updateFormData = this.updateForm.value;
    this.userService.updateUser(updateFormData).subscribe({
      next: (response: Res) => {
        if (response.success) {
          this.loginSuccess = true;
          this.loginMessage = response.message;
          this.manageUserService.setCurrentUser(updateFormData);

          setTimeout(() => {
            this.loginSuccess = false;
            this.loginMessage = '';
          }, 3000);
        } else {
          this.loginError = true;
          this.loginMessage = response.message;
          setTimeout(() => {
            this.loginError = false;
            this.loginMessage = '';
          }, 3000);
        }
      },
      error: (error: any) => {
        console.log('Error:', error);
        this.loginError = true;
        this.loginMessage = 'An error occurred while updating the profile.';

        setTimeout(() => {
          this.loginError = false;
          this.loginMessage = '';
        }, 3000);
      },
    });
  }
}
