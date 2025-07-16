import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IRegister } from '../models/iregister';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ILogin } from '../models/ilogin';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwt-payload';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'https://localhost:7251/api/Account';

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
      tap((res) => {
        localStorage.setItem('token', res.token);
        const payload = this.decodeToken(res.token);
        localStorage.setItem('userId', payload.sub);
        localStorage.setItem('email', payload.email);
        // role claim may be string or array
        const role =
          payload[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        localStorage.setItem(
          'role',
          Array.isArray(role) ? role[0] : role || ''
        );
      }),
      catchError((err) => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
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

  getUserId(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('userId')
      : null;
  }

  getEmail(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('email')
      : null;
  }

  getUserRole(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('role')
      : null;
  }

  isInRole(expectedRole: string): boolean {
    return this.getUserRole() === expectedRole;
  }

  private decodeToken(token: string): JwtPayload {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return {} as JwtPayload;
    }
  }
}
