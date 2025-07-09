import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-student-to-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Assign Students to Exam</h2>
      <div class="alert alert-secondary">Student assignment UI will appear here.</div>
    </div>
  `
})
export class AssignStudentToExamComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
} 