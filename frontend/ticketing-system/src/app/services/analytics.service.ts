import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Res } from '../interfaces/res';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  baseUrl = 'http://localhost:3005';
  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/analytics/getAllBookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
  getAdminTotalRevenue(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/analytics/totalRevenue`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
  getPlannerTotalRevenue(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/analytics/totalPlannerRevenue`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
