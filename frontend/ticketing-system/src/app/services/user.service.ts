import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { passwordReset, userRegister } from '../interfaces/users';
import { Observable } from 'rxjs';
import { Res } from '../interfaces/res';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'http://localhost:3005';
  constructor(private http: HttpClient) {}

  // Register User
  registerUser(user: userRegister): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/user/registerUser`, user);
  }
  updateUser(user: userRegister): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.put<Res>(`${this.baseUrl}/user/updateinfo`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  requestToBePlanner(role: string): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.post<Res>(
      `${this.baseUrl}/user/requestRoleChange`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  checkRoleRequest(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/checkRoleRequest`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  //get user chat room
  getChatRooms(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/getChatRooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getUserMessages(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/getUserMessages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  //function to get the role requests
  getRoleRequests(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/allRoleRequest`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  deleteRoleRequest(request_id: string): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.put<Res>(
      `${this.baseUrl}/user/deleteRoleRequest`,
      { request_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  approveRoleChangeRequest(updateRole: {
    request_id: string;
    approve: boolean;
  }): Observable<Res> {
    return this.http.post<Res>(
      `${this.baseUrl}/user/admin/approveRoleChangeRequest`,
      updateRole,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }

  //function to reset password
  requestPasswordReset(email: string): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/user/requestPasswordReset`, {
      email,
    });
  }
  resetPassword(passwordinfo: passwordReset): Observable<Res> {
    return this.http.post<Res>(`${this.baseUrl}/user/updatePassword`, {
      passwordinfo,
    });
  }
  //get all users
  getUsers(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/user/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
