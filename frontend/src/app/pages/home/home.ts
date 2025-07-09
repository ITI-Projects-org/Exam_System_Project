<<<<<<< HEAD
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

=======
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentsApi } from '../../services/students-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  students: any;

  constructor(
    private studentsApi: StudentsApi,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.studentsApi.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
>>>>>>> 14e87fe710e673150bd507328dc3ab91c33e0cf8
}
