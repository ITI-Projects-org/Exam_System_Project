import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit {
  examId: string | null = null;
  exam: any;
  canTakeExam = false;
  isLoading = true;
  error: string | null = null;
  studentAnswers: { [key: string]: any } = {}; // Holds selected answers per question

  constructor(
    private route: ActivatedRoute,
    private examService: ExamServices,
    public authService: AuthService,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe({
        next: (exam) => {
          this.exam = exam;
          this.isLoading = false;
          // Determine if exam is active based on startDate and duration
          const now = new Date();
          const start = new Date(exam.startDate);
          const [h, m, s] = exam.duration.split(':').map(Number);
          const endDate = new Date(start.getTime() + (h * 3600 + m * 60 + s) * 1000);
          const isActive = now >= start && now <= endDate;
          // Use getRoleFromToken from ExamServices for role check
          const role = this.examService.getRoleFromToken ? this.examService.getRoleFromToken() : (this.authService as any).currentUserRole;
          this.canTakeExam = role === 'student' && isActive;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to load exam.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No exam ID provided.';
      this.isLoading = false;
    }
  }

  startExam() {
    this.router.navigate(['/take-exam', this.examId, 'solve']);
  }

  submitExam(formValue: any) {
    if (!this.exam || !this.exam.questions) return;
    // Prepare answers as array of { questionId, optionId } using studentAnswers
    const answers = this.exam.questions.map((q: any, i: number) => {
      const qid = q.id || i;
      return {
        questionId: qid,
        optionId: this.studentAnswers[qid]
      };
    });
    // Call backend to submit answers (implement this in ExamServices if needed)
    this.examService.submitExam(this.examId || '', answers).subscribe({
      next: (result) => {
        alert('Exam submitted!');
        // Optionally show result/degree here
      },
      error: (err) => {
        alert('Failed to submit exam.');
      }
    });
  }
}
