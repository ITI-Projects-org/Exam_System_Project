import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExam } from '../../models/iexam';
import { ExamStudentDegreeDTO } from '../../services/exam-services';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Exam Details</h2>
        <div *ngIf="isTeacher && exam">
          <button class="btn btn-primary me-2" (click)="editExam()">
            <i class="fas fa-edit"></i> Edit Exam
          </button>
          <button class="btn btn-success" (click)="assignStudents()">
            <i class="fas fa-users"></i> Assign Students
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading exam details...</p>
      </div>

      <div *ngIf="errorMsg" class="error-alert">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <div *ngIf="!loading && !exam" class="alert alert-danger">
        Exam not found.
      </div>

      <div *ngIf="!loading && exam">
        <div class="exam-details-card">
          <div class="card-header-section">
            <h3 class="exam-title">{{ exam.title }}</h3>
            <div class="exam-meta">
              <span class="meta-item">
                <i class="fas fa-book"></i>
                Course ID: {{ exam.courseId }}
              </span>
              <span class="meta-item">
                <i class="fas fa-star"></i>
                Max Score: {{ exam.maxDegree }}
              </span>
              <span class="meta-item">
                <i class="fas fa-trophy"></i>
                Pass Score: {{ exam.minDegree }}
              </span>
            </div>
          </div>

          <div class="card-body-section">
            <div class="exam-info-grid">
              <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <div>
                  <span class="info-label">Start Date</span>
                  <span class="info-value">{{
                    exam.startDate | date : 'medium'
                  }}</span>
                </div>
              </div>
              <div class="info-item">
                <i class="fas fa-clock"></i>
                <div>
                  <span class="info-label">Duration</span>
                  <span class="info-value">{{ exam.duration }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-container *ngIf="isTeacher">
          <div class="students-section">
            <div class="section-header">
              <h4><i class="fas fa-users"></i> Assigned Students & Results</h4>
              <span class="student-count"
                >{{ students.length }} students assigned</span
              >
            </div>

            <div class="students-content">
              <div *ngIf="studentsLoading" class="loading-indicator">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-2">Loading students...</span>
              </div>

              <div
                *ngIf="!studentsLoading && students.length > 0"
                class="students-table"
              >
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Degree</th>
                      <th>Status</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let student of students">
                      <td>
                        <div class="student-info">
                          <i class="fas fa-user-graduate"></i>
                          {{ student.studentName }}
                        </div>
                      </td>
                      <td>
                        <span
                          class="degree-badge"
                          [class]="
                            getDegreeClass(student.degree, exam.minDegree)
                          "
                        >
                          {{ student.degree }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="status-badge"
                          [class]="
                            student.isAbsent ? 'bg-danger' : 'bg-success'
                          "
                        >
                          {{ student.isAbsent ? 'Absent' : 'Present' }}
                        </span>
                      </td>
                      <td>
                        <div class="performance-bar">
                          <div class="progress">
                            <div
                              class="progress-bar"
                              [class]="
                                getProgressBarClass(
                                  student.degree,
                                  exam.maxDegree
                                )
                              "
                              [style.width.%]="
                                getProgressPercentage(
                                  student.degree,
                                  exam.maxDegree
                                )
                              "
                            ></div>
                          </div>
                          <small class="text-muted"
                            >{{
                              getProgressPercentage(
                                student.degree,
                                exam.maxDegree
                              )
                            }}%</small
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                *ngIf="!studentsLoading && students.length === 0"
                class="empty-state"
              >
                <i class="fas fa-users-slash"></i>
                <h5>No Students Assigned</h5>
                <p>This exam doesn't have any assigned students yet.</p>
                <button class="btn btn-primary" (click)="assignStudents()">
                  <i class="fas fa-user-plus"></i> Assign Students
                </button>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="!isTeacher">
          <div class="student-view-section">
            <div class="section-header">
              <h4>
                <i class="fas fa-user-graduate"></i> Your Exam Information
              </h4>
            </div>
            <div class="student-content">
              <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                Your exam results, answers, and performance details will appear
                here once the exam is completed.
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      /* Loading States */
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 0;
      }

      .loading-spinner {
        position: relative;
        width: 60px;
        height: 60px;
      }

      .spinner-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top: 3px solid #667eea;
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
        font-size: 1.1rem;
        color: #6c757d;
        font-weight: 500;
      }

      .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #6c757d;
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

      /* Exam Details Card */
      .exam-details-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .card-header-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
      }

      .exam-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
      }

      .exam-meta {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
      }

      .card-body-section {
        padding: 2rem;
      }

      .exam-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .info-item:hover {
        background: #e9ecef;
        transform: translateX(5px);
      }

      .info-item i {
        font-size: 1.5rem;
        color: #667eea;
      }

      .info-label {
        display: block;
        font-size: 0.8rem;
        color: #6c757d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        display: block;
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
      }

      /* Students Section */
      .students-section {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      .section-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .section-header h4 {
        margin: 0;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .student-count {
        background: #667eea;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .students-content {
        padding: 2rem;
      }

      .students-table {
        overflow-x: auto;
      }

      .table {
        margin-bottom: 0;
      }

      .table thead th {
        background-color: #f8f9fa;
        border-bottom: 2px solid #dee2e6;
        font-weight: 600;
        color: #495057;
        padding: 1rem;
      }

      .table tbody td {
        padding: 1rem;
        vertical-align: middle;
      }

      .student-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
      }

      .student-info i {
        color: #667eea;
      }

      .degree-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .degree-badge.excellent {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
      }

      .degree-badge.good {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        color: white;
      }

      .degree-badge.pass {
        background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
        color: #212529;
      }

      .degree-badge.fail {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
      }

      .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .performance-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .progress {
        flex: 1;
        height: 8px;
        border-radius: 4px;
        background-color: #e9ecef;
      }

      .progress-bar {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-bar.excellent {
        background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
      }

      .progress-bar.good {
        background: linear-gradient(90deg, #17a2b8 0%, #138496 100%);
      }

      .progress-bar.pass {
        background: linear-gradient(90deg, #ffc107 0%, #e0a800 100%);
      }

      .progress-bar.fail {
        background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 3rem 2rem;
      }

      .empty-state i {
        font-size: 4rem;
        color: #dee2e6;
        margin-bottom: 1rem;
      }

      .empty-state h5 {
        color: #6c757d;
        margin-bottom: 0.5rem;
      }

      .empty-state p {
        color: #adb5bd;
        margin-bottom: 1.5rem;
      }

      /* Student View Section */
      .student-view-section {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      .student-content {
        padding: 2rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .exam-meta {
          flex-direction: column;
          gap: 1rem;
        }

        .exam-info-grid {
          grid-template-columns: 1fr;
        }

        .section-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .performance-bar {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class ExamDetails implements OnInit {
  exam: IExam | null = null;
  loading = true;
  studentsLoading = true;
  isTeacher = false;
  students: ExamStudentDegreeDTO[] = [];
  errorMsg = '';

  constructor(
    private examService: ExamServices,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Wait for token initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.isTeacher = this.getRoleFromToken() === 'Teacher';
      const id = this.route.snapshot.paramMap.get('id');

      if (id) {
        // Load exam details and students in parallel
        await this.loadExamData(id);
      } else {
        this.loading = false;
        this.errorMsg = 'Exam ID not provided';
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.loading = false;
      this.errorMsg = 'Failed to initialize component';
      this.cdr.detectChanges();
    }
  }

  private async loadExamData(examId: string): Promise<void> {
    try {
      // Load exam details and students in parallel
      const [examData, studentsData] = await Promise.all([
        this.examService.getExamById(examId).toPromise(),
        this.isTeacher
          ? this.examService.getStudentsOfExam(examId).toPromise()
          : Promise.resolve([]),
      ]);

      if (examData) {
        this.exam = examData;
        console.log('Exam details loaded successfully:', examData);
      }

      if (studentsData) {
        this.students = studentsData;
        console.log('Students loaded successfully:', studentsData);
      }

      this.loading = false;
      this.studentsLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading exam data:', error);
      this.loading = false;
      this.studentsLoading = false;
      this.errorMsg =
        'Failed to load exam data: ' +
        (error instanceof Error ? error.message : String(error));
      this.cdr.detectChanges();
    }
  }

  getRoleFromToken(): string {
    // For now, return Teacher since we're using teacher credentials
    return 'Teacher';
  }

  getDegreeClass(degree: number, minDegree?: number): string {
    if (!minDegree) return 'fail';
    const percentage = (degree / (this.exam?.maxDegree || 100)) * 100;

    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (degree >= minDegree) return 'pass';
    return 'fail';
  }

  getProgressBarClass(degree: number, maxDegree?: number): string {
    if (!maxDegree) return 'fail';
    const percentage = (degree / maxDegree) * 100;

    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 60) return 'pass';
    return 'fail';
  }

  getProgressPercentage(degree: number, maxDegree?: number): number {
    if (!maxDegree) return 0;
    return Math.round((degree / maxDegree) * 100);
  }

  editExam(): void {
    if (this.exam) {
      this.router.navigate(['/exams', this.exam.id, 'edit']);
    }
  }

  assignStudents(): void {
    if (this.exam) {
      this.router.navigate(['/exams', this.exam.id, 'assign']);
    }
  }
}
