import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Edit Exam</h2>
      <div class="alert alert-warning">Edit exam form will appear here.</div>
    </div>
  `
})
export class EditExamComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
} 