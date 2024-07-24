import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingData } from '../interfaces/events';
import { Res } from '../interfaces/res';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  baseUrl = 'http://localhost:3005';

  constructor(private http: HttpClient) {}

  makeBooking(bookingData: BookingData): Observable<Res> {
    console.log('token', localStorage.getItem('token'));
    return this.http.post<Res>(`${this.baseUrl}/book/bookEvent`, bookingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  getBookingByUser(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/book/getBookingsByUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }
  getBookingsByPlanner(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/book/getBookingsByPlanner`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }
}
