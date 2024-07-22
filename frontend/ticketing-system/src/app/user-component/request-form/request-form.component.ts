import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Res } from '../../interfaces/res';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
})
export class RequestFormComponent {
  requestRoleForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  hasRequested: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Initialize form with role fixed as 'Event Planner' and disabled
    this.requestRoleForm = this.fb.group({
      role: [{ value: 'Event Planner', disabled: true }, Validators.required],
    });
    this.userService.checkRoleRequest().subscribe(
      (response: Res) => {
        if (response.success) {
          if (response.message === 'Role change request found') {
            this.hasRequested = true;
          } else {
            this.hasRequested = false;
          }
        } else {
          this.errorMessage =
            response.message || 'Failed to check request status.';
        }
      },
      (error) => {
        this.errorMessage =
          'Failed to check request status. Please try again later.';
      }
    );
  }

  // Request role method
  requestRole() {
    if (this.hasRequested) {
      this.errorMessage =
        'You have already submitted a request to become an Event Planner.';
      return;
    }

    const role = 'Event Planner';

    this.userService.requestToBePlanner(role).subscribe(
      (response: Res) => {
        if (response.success) {
          this.successMessage = response.message;
          this.errorMessage = null;
          this.hasRequested = true;
        } else {
          this.successMessage = null;
          this.errorMessage =
            response.message || 'An error occurred. Please try again.';
        }
      },
      (error) => {
        this.errorMessage =
          error.error.message || 'An error occurred. Please try again.';
        this.successMessage = null;
      }
    );
  }
}
