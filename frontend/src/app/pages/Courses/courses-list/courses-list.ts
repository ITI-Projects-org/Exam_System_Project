import { Component } from '@angular/core';
import { BackendService } from '../../../services/Teacher-service';
import { Courses } from '../courses';

@Component({
  selector: 'app-courses-list',
  imports: [],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.css'
})
export class CoursesList {
courses: Courses[] = []

  constructor(private teaher: BackendService){}
  
}
