import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    const token = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(token);

    httpClient.get('/api/data').subscribe();

    const httpRequest = httpTestingController.expectOne('/api/data');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(
      `Bearer ${token}`
    );
  });

  it('should not add an Authorization header when no token is present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    httpClient.get('/api/data').subscribe();

    const httpRequest = httpTestingController.expectOne('/api/data');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });

  it('should handle 401 error with "Token expired" message', () => {
    spyOn(authService, 'handleTokenExpired');

    httpClient.get('/api/data').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.error.message).toBe('Token expired');
      },
    });

    const httpRequest = httpTestingController.expectOne('/api/data');
    httpRequest.flush(
      { message: 'Token expired' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(authService.handleTokenExpired).toHaveBeenCalled();
  });

  it('should not call handleTokenExpired for non-401 errors', () => {
    spyOn(authService, 'handleTokenExpired');

    httpClient.get('/api/data').subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const httpRequest = httpTestingController.expectOne('/api/data');
    httpRequest.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    expect(authService.handleTokenExpired).not.toHaveBeenCalled();
  });
});
