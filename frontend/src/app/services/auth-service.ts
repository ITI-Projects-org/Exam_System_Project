import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IRegister } from '../models/iregister';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ILogin } from '../models/ilogin';
import { isPlatformBrowser } from '@angular/common';
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
}
