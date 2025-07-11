import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    } catch (error) {
      console.error('Invalid token:', error);
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

  isTeacher(): boolean {
    return this.getUserRole() === 'Teacher';
  }
}
