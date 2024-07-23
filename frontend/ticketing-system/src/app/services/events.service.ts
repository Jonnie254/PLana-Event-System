import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Res } from '../interfaces/res';
import { Observable } from 'rxjs';
import { Event } from '../interfaces/events';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  baseUrl = 'http://localhost:3005';
  constructor(private http: HttpClient) {}
  createEvent(event: Event): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.post<Res>(`${this.baseUrl}/event/createEvent`, event, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getEvents(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/event/getAllEvents`);
  }
  getEventsByPlanner(): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.get<Res>(`${this.baseUrl}/event/getEventsByPlanner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getEventById(id: string): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/event/getEventById/${id}`);
  }
  updateEvent(event: Event): Observable<Res> {
    const token = localStorage.getItem('token');
    return this.http.put<Res>(
      `${this.baseUrl}/event/updateEvent/${event.id}`,
      event,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  getSingleEvent(id: string): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/event/getEventById/${id}`);
  }
  getUpcomngEvents(): Observable<Res> {
    return this.http.get<Res>(`${this.baseUrl}/event/upcomingEvents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }
  getEventsWithOrganizers(): Observable<Res> {
    return this.http.get<Res>(
      `${this.baseUrl}/event/getAllEventsWithOrganizers`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }
}
