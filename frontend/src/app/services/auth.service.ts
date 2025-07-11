export class AuthService {
  get currentUserRole(): string {
    // Example: get role from localStorage or JWT
    // console.log('Current user role:', localStorage.getItem('role'));
    return localStorage.getItem('role') || '';

  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRoleFromToken(): string {
    try {
      const token = this.getToken();
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
