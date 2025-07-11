import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { TeachersList } from './pages/teacher/teachers-list/teachers-list';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [Footer, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
}
