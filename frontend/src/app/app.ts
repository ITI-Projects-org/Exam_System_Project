import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
import { Student } from './pages/student/student';
import { Home } from "./pages/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Student, Home],
=======
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [Footer, Home, Navbar],
>>>>>>> 14e87fe710e673150bd507328dc3ab91c33e0cf8
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
}
