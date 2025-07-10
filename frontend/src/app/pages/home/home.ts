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
}
