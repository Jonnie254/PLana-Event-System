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
  styleUrl: './role-requests.component.css',
})
export class RoleRequestsComponent {
  roleRequests: Role[] = [];
  constructor(private userservice: UserService) {
    this.getRoleRequests();
  }

  getRoleRequests() {
    this.userservice.getRoleRequests().subscribe({
      next: (res: Res) => {
        this.roleRequests = res.data;
        console.log(this.roleRequests);
      },
      error: (err: Error) => {
        console.log(err);
      },
    });
  }
  onCheckboxChange(event: Event, roleId: string): void {
    const checkbox = event.target as HTMLInputElement;
    console.log(`Checkbox for role ${roleId} changed to ${checkbox.checked}`);
    // Handle the change as needed, e.g., update the role's approval status
  }
}
