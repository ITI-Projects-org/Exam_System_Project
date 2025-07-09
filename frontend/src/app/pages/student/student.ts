import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { error, log } from 'console';
import { Subscription } from 'rxjs';
import { StudentCoursesServices } from '../../services/student-courses-services';

@Component({
  selector: 'app-student',
  imports: [],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  Courses : any;
  ///cdr =inject(ChangeDetectorRef); //another way to inject
  constructor(private studentService: StudentCoursesServices , private cdr:ChangeDetectorRef){}
  
  ngOnInit(): void {
    this.studentService.getAllCourses().subscribe({
      next:(response)=>{
        this.Courses=response;
        this.cdr.detectChanges();
      },
      error:(error)=>{
        console.log(error);
      } 
    });  
  }
}
