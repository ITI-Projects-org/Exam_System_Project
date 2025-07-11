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
      tap((res) => {
        localStorage.setItem('token', res.token);
        const payload = this.decodeToken(res.token); // ✳️ استخراج البيانات من التوكن
        const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        localStorage.setItem('role', payload[roleClaim]);   // ✳️ تخزين الرول داخل localStorage
      }),
      catchError((err) => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // ✳️ نضيف كمان إزالة الـ role عند تسجيل الخروج
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

  // ✳️ استخراج role من التوكن مباشرة
  getUserRole(): string | null {
    const token = this.token;
    if (!token) return null;

    const payload = this.decodeToken(token);

    // ✅ نحاول نقرأ من المفتاح الرسمي الخاص بـ .NET
    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    return payload?.[roleClaim] || null;
  }

  // ✳️ هل المستخدم له Role معينة؟
  isInRole(expectedRole: string): boolean {
    return this.getUserRole() === expectedRole;
  }


  // ✳️ دالة فك تشفير JWT Token (بدون مكتبة خارجية)
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }
}
