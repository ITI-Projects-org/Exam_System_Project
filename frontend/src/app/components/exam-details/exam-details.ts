import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExam } from '../../models/iexam';
import { ExamStudentDegreeDTO } from '../../services/exam-services';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Exam Details</h2>
      <div *ngIf="loading" class="alert alert-info">Loading exam details...</div>
      <div *ngIf="!loading && !exam" class="alert alert-danger">Exam not found.</div>
      <div *ngIf="!loading && exam">
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="card-title">{{ exam.title }}</h4>
            <p class="card-text">
              <strong>Course ID:</strong> {{ exam.courseId }}<br>
              <strong>Max Degree:</strong> {{ exam.maxDegree }}<br>
              <strong>Min Degree:</strong> {{ exam.minDegree }}<br>
              <strong>Start:</strong> {{ exam.startDate | date:'medium' }}<br>
              <strong>Duration:</strong> {{ exam.duration }}
            </p>
          </div>
        </div>
        <ng-container *ngIf="isTeacher">
          <div class="card mb-3">
            <div class="card-header">Assigned Students & Degrees</div>
            <div class="card-body">
              <table class="table table-bordered" *ngIf="students.length > 0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Degree</th>
                    <th>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of students">
                    <td>{{ s.studentName }}</td>
                    <td>{{ s.degree }}</td>
                    <td>{{ s.isAbsent ? 'Yes' : 'No' }}</td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="students.length === 0" class="alert alert-secondary">No students assigned to this exam.</div>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="!isTeacher">
          <div class="card mb-3">
            <div class="card-header">Your Exam Info</div>
            <div class="card-body">
              <!-- TODO: Replace with real data -->
              <div class="alert alert-secondary">Your answers, degree, and correct answers will appear here if the exam is finished.</div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class ExamDetails implements OnInit {
  exam: IExam | null = null;
  loading = true;
  isTeacher = false;
  students: ExamStudentDegreeDTO[] = [];

  constructor(private examService: ExamServices, private route: ActivatedRoute, private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isTeacher = this.getRoleFromToken() === 'Teacher';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.examService.getExamById(id).subscribe({
        next: (data) => {
          this.exam = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        }
      });
      if (this.isTeacher) {
        this.examService.getStudentsOfExam(id).subscribe({
          next: (students) => {
            this.students = students;
          },
          error: (err) => {
            console.error('Error loading students for exam:', err);
          }
        });
      }
    } else {
      this.loading = false;
    }
    
  }

  getRoleFromToken(): string {
    const token = this.examService.token;
    if (!token) return '';
    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch {
      return '';
    }
  }
} 