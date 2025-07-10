import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Courses } from "./pages/Courses/courses";
import { TeachersList } from "./pages/teacher/teachers-list/teachers-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Courses, TeachersList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
}
