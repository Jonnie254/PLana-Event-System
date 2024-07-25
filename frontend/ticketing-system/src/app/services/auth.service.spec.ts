import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Res } from '../interfaces/res';
import { userLogin } from '../interfaces/users';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: spy }],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check auth status on initialization', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    spyOn(service as any, 'getUserDetails').and.returnValue(
      of({ success: true, data: { id: '123' } })
    );

    service['checkAuthStatus']();

    expect(service.isAuthenticatedSubject.value).toBeTrue();
    expect(service['userIdSubject'].value).toBe('123');
  });

  it('should login user and set token', () => {
    const mockLogin: userLogin = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockResponse: Res = {
      success: true,
      data: 'mock-token',
      message: 'User logged in successfully',
    };
    const mockUserDetails: Res = {
      success: true,
      message: 'User found',
      data: { id: '123', role: 'user' },
    };

    spyOn(localStorage, 'setItem');
    spyOn(service as any, 'getUserDetails').and.returnValue(
      of(mockUserDetails)
    );

    service.loginUser(mockLogin).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(service.isAuthenticatedSubject.value).toBeTrue();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/all-events']);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/auth/login`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get user details', () => {
    const mockResponse: Res = {
      success: true,
      data: { id: '123', role: 'user' },
      message: 'User found',
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.getUserDetails().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/user/getUserById`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });

  it('should redirect based on role', () => {
    service['redirectBasedOnRole']('admin');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-dashboard']);

    service['redirectBasedOnRole']('Event Planner');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/event-dashboard']);

    service['redirectBasedOnRole']('user');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/all-events']);

    service['redirectBasedOnRole']('unknown');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landing-page']);
  });

  it('should logout user', () => {
    spyOn(localStorage, 'removeItem');

    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(service.isAuthenticatedSubject.value).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landing-page']);
  });

  it('should handle token expiration', () => {
    spyOn(service, 'logout');

    service.handleTokenExpired();

    expect(service.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check if user is authenticated', () => {
    service.isAuthenticatedSubject.next(true);
    expect(service.isAuthenticated()).toBeTrue();

    service.isAuthenticatedSubject.next(false);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should set redirect URL', () => {
    service.setRedirectUrl('/test-url');
    expect(service['redirectUrl']).toBe('/test-url');
  });

  it('should use redirect URL if available', () => {
    service.setRedirectUrl('/custom-redirect');
    service['redirectBasedOnRole']('user');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/custom-redirect']);
    expect(service['redirectUrl']).toBeNull();
  });
});
