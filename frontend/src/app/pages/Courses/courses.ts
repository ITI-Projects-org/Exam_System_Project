import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/Teacher-service';
import { CoursesList } from './courses-list/courses-list';
import { SearchCourse } from './search-course/search-course';

@Component({
  selector: 'app-courses',
  imports: [CoursesList, SearchCourse],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {
  constructor(private teacher: BackendService) {}
  ngOnInit(): void {
    this.teacher.GetCourses().subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }
}
