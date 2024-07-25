import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/users';
import { UserService } from '../../services/user.service';
import { Res } from '../../interfaces/res';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  searchForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.searchForm.get('search')?.valueChanges.subscribe((value) => {
      this.paginateUsers(value);
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe((res: Res) => {
      if (res.success) {
        this.users = res.data;
        this.paginateUsers();
      }
    });
  }

  paginateUsers(searchTerm: string = '') {
    const filteredUsers = this.users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = filteredUsers.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginateUsers(this.searchForm.get('search')?.value);
  }

  goToNextPage() {
    if (this.currentPage * this.itemsPerPage < this.users.length) {
      this.currentPage++;
      this.paginateUsers(this.searchForm.get('search')?.value);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers(this.searchForm.get('search')?.value);
    }
  }

  totalPages(): number {
    const searchTerm = this.searchForm.get('search')?.value || '';
    const filteredUsers = this.users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return Math.ceil(filteredUsers.length / this.itemsPerPage);
  }
}
