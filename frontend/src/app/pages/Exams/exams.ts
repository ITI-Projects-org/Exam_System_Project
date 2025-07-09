import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExamListItem } from '../../models/iexam';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Exams</h2>
        <ng-container *ngIf="isTeacher">
          <a [routerLink]="['/exams/new']" class="btn btn-success">
            <i class="fas fa-plus"></i> Create New Exam
          </a>
        </ng-container>
      </div>
      <div *ngIf="loading" class="alert alert-info">Loading exams...</div>
      <div *ngIf="errorMsg" class="alert alert-danger">{{errorMsg}}</div>
      <div *ngIf="!loading && !errorMsg && exams.length === 0" class="alert alert-warning">No exams found.</div>
      <pre>{{ exams | json }}</pre>
      <div class="row" *ngIf="!loading && !errorMsg && exams.length > 0">
        <div class="col-md-4 mb-3" *ngFor="let exam of exams">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ exam.title }}</h5>
              <p class="card-text">
                <strong>Start:</strong> {{ exam.startDate | date:'medium' }}<br>
                <strong>End:</strong> {{ exam.endDate | date:'medium' }}<br>
                <strong>Duration:</strong> {{ exam.duration }}<br>
                <strong>Max Degree:</strong> {{ exam.maxDegree }}<br>
                <strong>Min Degree:</strong> {{ exam.minDegree }}
              </p>
              <a [routerLink]="['/exams', exam.id]" class="btn btn-primary btn-sm">Details</a>
              <ng-container *ngIf="isTeacher">
                <a [routerLink]="['/exams', exam.id, 'edit']" class="btn btn-warning btn-sm ms-2">Edit</a>
                <a [routerLink]="['/exams', exam.id, 'assign-students']" class="btn btn-secondary btn-sm ms-2">Assign Students</a>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExamsComponent implements OnInit {
  exams: IExamListItem[] = [];
  loading = true;
  isTeacher = false;
  errorMsg = '';

  constructor(private examService: ExamServices, private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isTeacher = this.getRoleFromToken() === 'Teacher';
    this.examService.getExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Failed to load exams: ' + (err?.message || err);
        console.error('Exams API error:', err);
      }
    });
  }

  getRoleFromToken(): string {
    // Decode JWT and extract role (assumes role claim is present)
    const token = this.examService.token;
    if (!token) return '';
    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      // Adjust claim name if needed
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch {
      return '';
    }
  }
} 