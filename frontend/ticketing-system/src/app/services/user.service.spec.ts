import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Res } from '../interfaces/res';
import { userRegister, passwordReset } from '../interfaces/users';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockUser: userRegister = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123',
      email: 'john.doe@example.com',
      phone: '1234567890',
      profileImage: 'http://example.com/profile.jpg',
    };
    const mockResponse: Res = {
      success: true,
      message: 'User registered successfully',
      data: null,
    };

    service.registerUser(mockUser).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/user/registerUser`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('should update a user', () => {
    const mockUser: userRegister = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'newpassword123',
      email: 'john.doe@example.com',
      phone: '0987654321',
      profileImage: 'http://example.com/new-profile.jpg',
    };
    const mockResponse: Res = {
      success: true,
      message: 'User updated successfully',
      data: null,
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.updateUser(mockUser).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/user/updateinfo`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });

  // ... (rest of the test cases remain the same)

  it('should reset password', () => {
    const mockPasswordReset: passwordReset = {
      resetCode: 'reset-token',
      newPassword: 'newpassword123',
    };
    const mockResponse: Res = {
      success: true,
      message: 'Password reset successful',
      data: null,
    };

    service.resetPassword(mockPasswordReset).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.baseUrl}/user/updatePassword`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ passwordinfo: mockPasswordReset });
    req.flush(mockResponse);
  });
});
