import { Component } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { RouterOutlet } from '@angular/router';
import { Courses } from "./pages/Courses/courses";
import { TeachersList } from "./pages/teacher/teachers-list/teachers-list";
import { Teacher } from "./pages/teacher/teacher";
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [Footer, Navbar, RouterOutlet, Courses, TeachersList, Teacher,CommonModule,],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
  constructor(public authService: AuthService) {}
}
