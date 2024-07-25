import { TestBed } from '@angular/core/testing';
import { BookingsService } from './bookings.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Res } from '../interfaces/res';
import { BookingData } from '../interfaces/events';

describe('BookingsService', () => {
  let service: BookingsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingsService],
    });
    service = TestBed.inject(BookingsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a booking', () => {
    const mockBookingData: BookingData = {
      eventId: '1',
      ticketType: 'single',
    };
    const mockResponse: Res = {
      success: true,
      message: 'Booking created',
      data: null,
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.makeBooking(mockBookingData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/book/bookEvent`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    expect(req.request.body).toEqual(mockBookingData);
    req.flush(mockResponse);
  });

  it('should make a group booking', () => {
    const mockBookingData: BookingData = {
      eventId: '1',
      ticketType: 'group',
      groupEmails: ['test1@example.com', 'test2@example.com'],
    };
    const mockResponse: Res = {
      success: true,
      message: 'Group booking created',
      data: null,
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.makeBooking(mockBookingData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/book/bookEvent`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    expect(req.request.body).toEqual(mockBookingData);
    req.flush(mockResponse);
  });

  it('should get bookings by user', () => {
    const mockResponse: Res = {
      success: true,
      message: 'Bookings found',
      data: [{ id: '1', eventId: '1', userId: '1', ticketType: 'single' }],
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.getBookingByUser().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/book/getBookingsByUser`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });

  it('should get bookings by planner', () => {
    const mockResponse: Res = {
      success: true,
      message: 'Bookings found',
      data: [{ id: '1', eventId: '1', plannerId: '1', ticketType: 'group' }],
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.getBookingsByPlanner().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/book/getBookingsByPlanner`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });
});
