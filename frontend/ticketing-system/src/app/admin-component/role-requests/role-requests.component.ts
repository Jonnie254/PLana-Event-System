import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';
import { Role } from '../../interfaces/users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-requests.component.html',
  styleUrls: ['./role-requests.component.css'],
})
export class RoleRequestsComponent {
  roleRequests: Role[] = [];
  selectedRoleId: string = '';
  actionType: 'delete' | 'approve' | '' = ''; // Action type to determine which operation to perform
  confirmationModel: boolean = false;

  constructor(private userService: UserService) {
    this.getRoleRequests();
  }

  getRoleRequests() {
    this.userService.getRoleRequests().subscribe({
      next: (res: Res) => {
        this.roleRequests = res.data;
        console.log(this.roleRequests);
      },
      error: (err: Error) => {
        console.log(err);
      },
    });
  }

  confirmDeleteRole(requestId: string) {
    this.selectedRoleId = requestId;
    this.actionType = 'delete'; // Set action type to delete
    this.confirmationModel = true;
  }

  confirmApproveRole(requestId: string) {
    this.selectedRoleId = requestId;
    this.actionType = 'approve'; // Set action type to approve
    this.confirmationModel = true;
  }

  confirmAction() {
    if (this.selectedRoleId) {
      if (this.actionType === 'delete') {
        this.deleteRoleRequest();
      } else if (this.actionType === 'approve') {
        this.approveRoleRequest();
      }
      this.closeModal();
    }
  }

  deleteRoleRequest() {
    this.userService.deleteRoleRequest(this.selectedRoleId).subscribe({
      next: (res: Res) => {
        console.log(res);
        this.getRoleRequests();
      },
      error: (err: Error) => {
        console.log(err);
      },
    });
  }

  approveRoleRequest() {
    this.userService
      .approveRoleChangeRequest({
        request_id: this.selectedRoleId,
        approve: true, // or false depending on your logic
      })
      .subscribe({
        next: (res: Res) => {
          console.log(res);
          this.getRoleRequests();
        },
        error: (err) => {
          // Use HttpErrorResponse to get detailed error
          console.log(err);
        },
      });
  }

  closeModal() {
    this.confirmationModel = false;
    this.selectedRoleId = '';
    this.actionType = '';
  }

  onCheckboxChange(event: Event, roleId: string): void {
    const checkbox = event.target as HTMLInputElement;
    const newStatus = checkbox.checked;

    if (newStatus) {
      this.confirmApproveRole(roleId);
    } else {
      // Optionally handle the case where the checkbox is unchecked
      console.log(`Checkbox for role ${roleId} changed to ${newStatus}`);
    }
  }

  isCheckboxDisabled(approved: boolean): boolean {
    return approved;
  }
}
