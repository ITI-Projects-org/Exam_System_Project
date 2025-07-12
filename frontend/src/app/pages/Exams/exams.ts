import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExamListItem } from '../../models/iexam';
import { firstValueFrom } from 'rxjs';
import { nextTick } from 'process';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h2 class="page-title">
              <i class="fas fa-graduation-cap title-icon"></i>
              Exams Dashboard
            </h2>
            <p class="page-subtitle">
              Manage and monitor all your examinations
            </p>
          </div>
          <ng-container *ngIf="isTeacher">
            <button [routerLink]="['/exams/0/edit']" class="create-btn">
              <i class="fas fa-plus"></i>
              <span>Create Exam</span>
            </button>
          </ng-container>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading your exams...</p>
      </div>

      <div *ngIf="errorMsg" class="error-alert">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <div
        *ngIf="!loading && !errorMsg && exams.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <h3>No Exams Found</h3>
        <p>Start by creating your first examination</p>
        <ng-container *ngIf="isTeacher">
          <button [routerLink]="['/exams/0/edit']" class="create-first-btn">
            <i class="fas fa-plus"></i>
            Create Your First Exam
          </button>
        </ng-container>
      </div>

      <div class="exams-grid" *ngIf="!loading && !errorMsg && exams.length > 0">
        <div
          class="exam-card-wrapper"
          *ngFor="let exam of exams; trackBy: trackByExamId"
        >
          <div
            class="exam-card"
            [class]="getExamStatusClass(exam).toLowerCase()"
          >
            <div class="card-header-section">
              <div class="status-badge" [class]="getExamStatusClass(exam)">
                <i [class]="getStatusIcon(exam)"></i>
                {{ getExamStatus(exam) }}
              </div>
              <div class="exam-title-section">
                <h3 class="exam-title">{{ exam.title }}</h3>
                <div class="exam-date">
                  <i class="fas fa-calendar-alt"></i>
                  {{ exam.startDate | date : 'MMM dd, yyyy' }}
                </div>
              </div>
            </div>

            <div class="card-body-section">
              <div class="exam-stats">
                <div class="stat-item">
                  <div class="stat-icon duration-icon">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Duration</span>
                    <span class="stat-value">{{ exam.duration }} min</span>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon time-icon">
                    <i class="fas fa-play-circle"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Start Time</span>
                    <span class="stat-value">{{
                      exam.startDate | date : 'HH:mm'
                    }}</span>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon end-icon">
                    <i class="fas fa-stop-circle"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">End Time</span>
                    <span class="stat-value">{{
                      exam.endDate | date : 'HH:mm'
                    }}</span>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon score-icon">
                    <i class="fas fa-star"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Max Score</span>
                    <span class="stat-value">{{ exam.maxDegree }} pts</span>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon pass-icon">
                    <i class="fas fa-trophy"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Pass Score</span>
                    <span class="stat-value">{{ exam.minDegree }} pts</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer-section">
              <!-- Test Button for Debugging -->
              <div *ngIf="isStudent" style="margin-bottom: 10px;">
                <button (click)="testExamStatus(exam.id)" style="background: orange; color: white; padding: 5px 10px; border: none; border-radius: 5px; font-size: 12px;">
                  Test Status
                </button>
              </div>
              
              <div class="action-buttons">
                <button [routerLink]="['/exams', exam.id]" class="btn-primary">
                  <i class="fas fa-eye"></i>
                  <span>View Details</span>
                </button>

                <!-- Take Exam Button - Show only if student, exam is active, and not taken -->
                <ng-container *ngIf="canTakeExam(exam)">
                  <button [routerLink]="['/take-exam', exam.id]" class="btn btn-success">
                    <i class="fas fa-play"></i>
                    Take Exam
                  </button>
                </ng-container>

                <!-- View Results Button - Show only if student has taken the exam -->
                <ng-container *ngIf="canViewResults(exam)">
                  <button [routerLink]="['/take-exam', exam.id, 'solve']" class="btn btn-info">
                    <i class="fas fa-chart-bar"></i>
                    View Results
                  </button>
                </ng-container>
                <ng-container *ngIf="isTeacher">
                  <div class="teacher-actions">
                    <button
                      [routerLink]="['/exams', exam.id, 'edit']"
                      class="btn-secondary"
                      title="Edit Exam"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      [routerLink]="['/exams/', exam.id, 'assign']"
                      class="btn-secondary"
                      title="Assign Students"
                    >
                      <i class="fas fa-users"></i>
                    </button>
                    <button
                      (click)="deleteExam(exam.id)"
                      class="btn-danger"
                      title="Delete Exam"
                    >
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
  styles: [
    `
      /* Page Header */
      .page-header {
        margin-bottom: 2rem;
        padding: 2rem 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        color: white;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
      }

      .title-section {
        flex: 1;
      }

      .page-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .title-icon {
        font-size: 2rem;
        color: #ffd700;
      }

      .page-subtitle {
        font-size: 1.1rem;
        opacity: 0.9;
        margin: 0.5rem 0 0 0;
      }

      .create-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .create-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }

      /* Loading State */
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 0;
      }

      .loading-spinner {
        position: relative;
        width: 80px;
        height: 80px;
      }

      .spinner-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 4px solid transparent;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1.2s linear infinite;
      }

      .spinner-ring:nth-child(2) {
        border-top-color: #764ba2;
        animation-delay: 0.4s;
      }

      .spinner-ring:nth-child(3) {
        border-top-color: #ffd700;
        animation-delay: 0.8s;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-text {
        margin-top: 1rem;
        font-size: 1.2rem;
        color: #6c757d;
        font-weight: 500;
      }

      /* Error State */
      .error-alert {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 1.1rem;
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .empty-icon {
        font-size: 5rem;
        color: #dee2e6;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        color: #6c757d;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }

      .empty-state p {
        color: #adb5bd;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }

      .create-first-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .create-first-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      /* Exams Grid */
      .exams-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        gap: 2rem;
        padding: 1rem 0;
      }

      .exam-card-wrapper {
        perspective: 1000px;
      }

      .exam-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .exam-card:hover {
        transform: translateY(-10px) rotateX(5deg);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .exam-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2, #ffd700);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .exam-card:hover::before {
        opacity: 1;
      }

      /* Status-based styling */
      .exam-card.upcoming {
        border-left: 4px solid #17a2b8;
      }

      .exam-card.active {
        border-left: 4px solid #28a745;
      }

      .exam-card.completed {
        border-left: 4px solid #6c757d;
      }

      /* Card Header */
      .card-header-section {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 1.5rem;
        position: relative;
      }

      .status-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      }

      .status-badge.bg-info {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      }

      .status-badge.bg-success {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      }

      .status-badge.bg-secondary {
        background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
      }

      .exam-title-section {
        margin-top: 1rem;
      }

      .exam-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        line-height: 1.3;
      }

      .exam-date {
        color: #6c757d;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Card Body */
      .card-body-section {
        padding: 1.5rem;
        flex: 1;
      }

      .exam-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .stat-item:hover {
        background: #e9ecef;
        transform: translateX(5px);
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1rem;
      }

      .duration-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .time-icon {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      }
      .end-icon {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      }
      .score-icon {
        background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
      }
      .pass-icon {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      }

      .stat-content {
        display: flex;
        flex-direction: column;
      }

      .stat-label {
        font-size: 0.8rem;
        color: #6c757d;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-value {
        font-size: 1rem;
        font-weight: 700;
        color: #2c3e50;
      }

      /* Card Footer */
      .card-footer-section {
        padding: 1.5rem;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }

      .action-buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }

      .btn-success {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 3px 10px rgba(40, 167, 69, 0.3);
      }

      .btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
      }

      .btn-info {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 3px 10px rgba(23, 162, 184, 0.3);
      }

      .btn-info:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(23, 162, 184, 0.4);
      }

      .teacher-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-secondary,
      .btn-danger {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        color: white;
      }

      .btn-secondary {
        background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
        box-shadow: 0 3px 10px rgba(255, 193, 7, 0.3);
      }

      .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
      }

      .btn-danger {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        box-shadow: 0 3px 10px rgba(220, 53, 69, 0.3);
      }

      .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .page-title {
          font-size: 2rem;
        }

        .exams-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .exam-stats {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .action-buttons {
          flex-direction: column;
          gap: 1rem;
        }

        .teacher-actions {
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .page-header {
          padding: 1.5rem 0;
        }

        .header-content {
          padding: 0 1rem;
        }

        .exam-card {
          margin: 0 0.5rem;
        }
      }
    `,
  ],
})
export class ExamsComponent implements OnInit {
  exams: IExamListItem[] = [];
  loading = true;
  isTeacher = false;
  isStudent = false;
  errorMsg = '';
  examTakenStatus: { [examId: number]: boolean } = {};

  constructor(
    private examService: ExamServices,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Wait a bit for token initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.isTeacher = this.examService.getRoleFromToken() === 'Teacher';
      this.isStudent = this.examService.getRoleFromToken() === 'Student';
      console.log(this.examService.getRoleFromToken());
      this.examService.getExams().subscribe({
        next: (data) => {
          console.log('Exams loaded successfully:', data);
          this.exams = data;
          
          // Check taken status for each exam if student
          if (this.isStudent) {
            this.checkExamTakenStatus();
          } else {
            this.loading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error loading exams:', err);
          this.loading = false;
          this.errorMsg = 'Failed to load exams: ' + (err?.message || err);
          this.cdr.detectChanges();
        },
      });
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.loading = false;
      this.errorMsg = 'Failed to initialize: ' + error;
      this.cdr.detectChanges();
    }
  }

  // Test method to manually check exam status
  testExamStatus(examId: number) {
    console.log(`Testing exam status for exam ${examId}...`);
    this.examService.isExamTaken(examId).subscribe({
      next: (isTaken) => {
        console.log(`Exam ${examId} isTaken result:`, isTaken);
        console.log(`Type of result:`, typeof isTaken);
        console.log(`Raw result:`, isTaken);
      },
      error: (err) => {
        console.error(`Error testing exam ${examId}:`, err);
      }
    });
  }

  trackByExamId(index: number, exam: IExamListItem): number {
    return exam.id;
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

  getStatusIcon(exam: IExamListItem): string {
    const status = this.getExamStatus(exam);
    switch (status) {
      case 'Upcoming':
        return 'fas fa-clock';
      case 'Active':
        return 'fas fa-play-circle';
      case 'Completed':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-question-circle';
    }
  }

  deleteExam(examId: number) {
    if (
      confirm(
        'Are you sure you want to delete this exam? This action cannot be undone.'
      )
    ) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          // Remove the exam from the local array
          this.exams = this.exams.filter((exam) => exam.id !== examId);
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
          alert('Failed to delete exam. Please try again.');
        },
      });
    }
  }
   async checkExamTakenStatus() {
    try {
      const promises = this.exams.map(exam => 
        firstValueFrom(this.examService.isExamTaken(exam.id))
      );
      
      const results = await Promise.all(promises);
      
      this.exams.forEach((exam, index) => {
        this.examTakenStatus[exam.id] = results[index] || false;
        console.log(`Exam ${exam.id} (${exam.title}) - Taken: ${this.examTakenStatus[exam.id]}, Raw result: ${results[index]}`);
      });
      console.log('Final examTakenStatus object:', this.examTakenStatus);
      
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error checking exam taken status:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  isExamTaken(examId: number): boolean {
    return this.examTakenStatus[examId] || false;
  }

  canTakeExam(exam: IExamListItem): boolean {
    if (!this.isStudent) return false;
    
    const status = this.getExamStatus(exam);
    const isTaken = this.isExamTaken(exam.id);
    const canTake = status === 'Active' && !isTaken;
    
    console.log(`canTakeExam for ${exam.id} (${exam.title}): status=${status}, isTaken=${isTaken}, canTake=${canTake}`);
    return canTake;
  }

  canViewResults(exam: IExamListItem): boolean {
    if (!this.isStudent) return false;
    
    const status = this.getExamStatus(exam);
    const isTaken = this.isExamTaken(exam.id);
    const canView = (status === 'Completed' || status === 'Active') && isTaken;
    
    console.log(`canViewResults for ${exam.id} (${exam.title}): status=${status}, isTaken=${isTaken}, canView=${canView}`);
    return canView;
  }
  

 
  gteToken():string|null{
    return localStorage.getItem('token')
  }
  
}