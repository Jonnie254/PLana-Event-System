import { TestBed } from '@angular/core/testing';
import { EventsService } from './events.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Res } from '../interfaces/res';
import { Event } from '../interfaces/events';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService],
    });
    service = TestBed.inject(EventsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an event', () => {
    const mockEvent: Event = { id: '1', name: 'Test Event' } as Event;
    const mockResponse: Res = {
      success: true,
      message: 'Event created',
      data: mockEvent,
    };

    service.createEvent(mockEvent).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/createEvent`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBeTruthy();
    req.flush(mockResponse);
  });

  it('should get all events', () => {
    const mockEvents: Res = {
      success: true,
      message: 'Events found',
      data: [
        { id: '1', name: 'Event 1' },
        { id: '2', name: 'Event 2' },
      ],
    };

    service.getEvents().subscribe((res) => {
      expect(res).toEqual(mockEvents);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/getAllEvents`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should get events by planner', () => {
    const mockEvents: Res = {
      success: true,
      message: 'Events found',
      data: [{ id: '1', name: 'Planner Event' }],
    };

    service.getEventsByPlanner().subscribe((res) => {
      expect(res).toEqual(mockEvents);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/getEventsByPlanner`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBeTruthy();
    req.flush(mockEvents);
  });

  it('should get event by id', () => {
    const eventId = '1';
    const mockEvent: Res = {
      success: true,
      message: 'Event found',
      data: { id: '1', name: 'Test Event' },
    };

    service.getEventById(eventId).subscribe((res) => {
      expect(res).toEqual(mockEvent);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/getEventById/${eventId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('should update an event', () => {
    const mockEvent: Event = { id: '1', name: 'Updated Event' } as Event;
    const mockResponse: Res = {
      success: true,
      message: 'Event updated',
      data: null,
    };

    service.updateEvent(mockEvent).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/updateEvent/${mockEvent.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBeTruthy();
    req.flush(mockResponse);
  });

  it('should get upcoming events', () => {
    const mockEvents: Res = {
      success: true,
      message: 'Upcoming events found',
      data: [{ id: '1', name: 'Upcoming Event' }],
    };

    service.getUpcomngEvents().subscribe((res) => {
      expect(res).toEqual(mockEvents);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/upcomingEvents`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBeTruthy();
    req.flush(mockEvents);
  });

  it('should request event promotion', () => {
    const eventId = '1';
    const mockResponse: Res = {
      success: true,
      message: 'Promotion requested',
      data: null,
    };

    service.requestEventPromotion(eventId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/requestpromotion/${eventId}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBeTruthy();
    req.flush(mockResponse);
  });

  it('should approve event promotion', () => {
    const promotionId = '1';
    const mockResponse: Res = {
      success: true,
      message: 'Promotion approved',
      data: null,
    };

    service.approveEventPromotion(promotionId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/event/approvepromotion/${promotionId}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBeTruthy();
    req.flush(mockResponse);
  });
});
