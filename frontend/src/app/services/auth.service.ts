import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IRegister } from '../models/iregister';
import { ILogin } from '../models/ilogin';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'https://localhost:7251/api/Account';
  currentUserRole: string | undefined;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(dto: IRegister): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/register`, dto)
      .pipe(catchError((err) => throwError(() => err)));
  }

  login(dto: ILogin): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, dto).pipe(
      tap((res) => localStorage.setItem('token', res.token)),
      catchError((err) => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  get currentUserRoleValue(): string {
    return localStorage.getItem('role') || '';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoleFromToken(): string {
    try {
      const token = this.token;
      if (!token) return 'Guest';
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      if (decodedPayload.role) {
        return decodedPayload.role;
      } else if (decodedPayload.roles) {
        return Array.isArray(decodedPayload.roles) ? decodedPayload.roles[0] : decodedPayload.roles;
      } else if (decodedPayload.Role) {
        return decodedPayload.Role;
      } else if (decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        return decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      } else {
        for (const key of Object.keys(decodedPayload)) {
          if (decodedPayload[key] === 'Student' || decodedPayload[key] === 'Teacher') {
            return decodedPayload[key];
          }
        }
        return 'Guest';
      }
    } catch (error) {
      return 'Guest';
    }
  }
}
