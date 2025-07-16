import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public auth: AuthService) {}
  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }
  get userRole() {
    return this.auth.getUserRole();
  }
  get isStudent() {
    return this.auth.isInRole('Student');
  }
  get isTeacher() {
    return this.auth.isInRole('Teacher');
  }
}
