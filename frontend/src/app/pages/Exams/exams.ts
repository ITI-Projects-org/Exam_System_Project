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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">
            <i class="fas fa-file-alt text-primary me-2"></i>
            Exams
          </h2>
          <p class="text-muted mb-0">Manage and view all available exams</p>
        </div>
        <ng-container *ngIf="isTeacher">
          <a [routerLink]="['/exams/0/edit']" class="btn btn-success">
            <i class="fas fa-plus me-2"></i>Create New Exam
          </a>
        </ng-container>
      </div>
      
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading exams...</p>
      </div>
      
      <div *ngIf="errorMsg" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{errorMsg}}
      </div>
      
      <div *ngIf="!loading && !errorMsg && exams.length === 0" class="text-center py-5">
        <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No exams found</h4>
        <p class="text-muted">Get started by creating your first exam.</p>
        <ng-container *ngIf="isTeacher">
          <a [routerLink]="['/exams/0/edit']" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>Create First Exam
          </a>
        </ng-container>
      </div>
      
      <div class="row" *ngIf="!loading && !errorMsg && exams.length > 0">
        <div class="col-lg-4 col-md-6 mb-4" *ngFor="let exam of exams">
          <div class="card h-100 shadow-sm border-0 exam-card">
            <div class="card-header bg-gradient-primary text-white">
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <h5 class="card-title mb-1 text-white">{{ exam.title }}</h5>
                  <small class="text-white-50">
                    <i class="fas fa-calendar-alt me-1"></i>
                    {{ exam.startDate | date:'MMM dd, yyyy' }}
                  </small>
                </div>
                <div class="exam-status-badge">
                  <span class="badge" [class]="getExamStatusClass(exam)">
                    {{ getExamStatus(exam) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="card-body">
              <div class="exam-info-grid">
                <div class="info-item">
                  <i class="fas fa-clock text-primary me-2"></i>
                  <div>
                    <small class="text-muted d-block">Duration</small>
                    <strong>{{ exam.duration }} minutes</strong>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-calendar-day text-success me-2"></i>
                  <div>
                    <small class="text-muted d-block">Start Time</small>
                    <strong>{{ exam.startDate | date:'HH:mm' }}</strong>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-calendar-check text-danger me-2"></i>
                  <div>
                    <small class="text-muted d-block">End Time</small>
                    <strong>{{ exam.endDate | date:'HH:mm' }}</strong>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-star text-warning me-2"></i>
                  <div>
                    <small class="text-muted d-block">Max Score</small>
                    <strong>{{ exam.maxDegree }} points</strong>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-trophy text-info me-2"></i>
                  <div>
                    <small class="text-muted d-block">Passing Score</small>
                    <strong>{{ exam.minDegree }} points</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-footer bg-light border-0">
              <div class="d-flex justify-content-between align-items-center">
                <a [routerLink]="['/exams', exam.id]" class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-eye me-1"></i>View Details
                </a>
                
                <ng-container *ngIf="isTeacher">
                  <div class="btn-group" role="group">
                    <a [routerLink]="['/exams', exam.id, 'edit']" class="btn btn-outline-warning btn-sm">
                      <i class="fas fa-edit"></i>
                    </a>
                    <a [routerLink]="['/exams', exam.id, 'assign-students']" class="btn btn-outline-secondary btn-sm">
                      <i class="fas fa-users"></i>
                    </a>
                    <button (click)="deleteExam(exam.id)" class="btn btn-outline-danger btn-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exam-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .exam-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    }
    
    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .exam-status-badge {
      position: absolute;
      top: 10px;
      right: 15px;
    }
    
    .exam-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .info-item {
      display: flex;
      align-items: flex-start;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    
    .info-item:hover {
      background: #e9ecef;
    }
    
    .info-item i {
      margin-top: 2px;
    }
    
    .btn-group .btn {
      border-radius: 6px !important;
      margin-left: 2px;
    }
    
    .btn-group .btn:first-child {
      margin-left: 0;
    }
    
    @media (max-width: 768px) {
      .exam-info-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      
      .info-item {
        padding: 0.25rem;
      }
    }
  `]
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

  getExamStatus(exam: IExamListItem): string {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    
    if (now < startDate) {
      return 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
      return 'Active';
    } else {
      return 'Completed';
    }
  }

  getExamStatusClass(exam: IExamListItem): string {
    const status = this.getExamStatus(exam);
    switch (status) {
      case 'Upcoming':
        return 'bg-info';
      case 'Active':
        return 'bg-success';
      case 'Completed':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  deleteExam(examId: number) {
    if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          // Remove the exam from the local array
          this.exams = this.exams.filter(exam => exam.id !== examId);
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
          alert('Failed to delete exam. Please try again.');
        }
      });
    }
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