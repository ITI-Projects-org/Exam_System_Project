import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/Teacher-service';
import { Navbar } from "../../layout/navbar/navbar";

@Component({
  selector: 'app-courses',
  imports: [Navbar],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  constructor(private teacher: BackendService) { }
  ngOnInit(): void {
   this.teacher.GetCourses().subscribe({
      next: (data) => {
        console.log(data);
      }
  });
  }
}
