import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { AuthService } from '../../services/auth.service';
import { IExam } from '../../models/iexam';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-exam-solve',
  templateUrl: './take-exam-solve.component.html',
  imports: [ FormsModule],
  styleUrls: ['./take-exam-solve.component.css']
})
export class TakeExamSolveComponent implements OnInit {
  examId: string | null = null;
  exam: IExam | null = null;
  isStudent = false;
  isActive = false;
  submitted = false;
  degree: number | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamServices,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    this.isStudent = this.authService.currentUserRole === 'student';
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe({
        next: (exam) => {
          this.exam = exam;
          // Determine if exam is active based on startDate and endDate
          const now = new Date();
          const start = new Date(exam.startDate);
          // If endDate exists, use it, else use duration
          let end: Date;
          if ((exam as any).endDate) {
            end = new Date((exam as any).endDate);
          } else {
            // fallback: add duration to startDate
            const [h, m, s] = exam.duration.split(':').map(Number);
            end = new Date(start.getTime() + (h * 3600 + m * 60 + s) * 1000);
          }
          this.isActive = now >= start && now <= end;
        },
        error: (err) => {
          this.error = 'Failed to load exam.';
        }
      });
    } else {
      this.error = 'No exam ID provided.';
    }
  }

  submitExam(answers: any) {
    // Transform answers to backend format if needed
    // Example: { q1: 'answer1', q2: 'answer2' } => [{ questionId: 1, answer: 'answer1' }, ...]
    const formattedAnswers = Object.keys(answers).map(key => {
      const questionId = Number(key.replace('q', ''));
      return { questionId, answer: answers[key] };
    });
    this.examService.submitExam(this.examId!, formattedAnswers).subscribe({
      next: (result) => {
        this.degree = result.degree;
        this.submitted = true;
      },
      error: (err) => {
        this.error = 'Failed to submit exam.';
      }
    });
  }
}
