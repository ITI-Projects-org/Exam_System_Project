import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Student } from './pages/student/student';
import { Home } from "./pages/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Student, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
}
