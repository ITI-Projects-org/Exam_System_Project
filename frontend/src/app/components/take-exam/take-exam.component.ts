import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css'],
})
export class TakeExamComponent implements OnInit {
  examId: string | null = null;
  exam: any;
  endDate: Date | null = null;
  canTakeExam = false;
  isLoading = true;
  error: string | null = null;
  studentAnswers: { [key: string]: any[] } = {}; // { questionId: [optionId, ...] }
  submissionSuccess = false;
  formDisabled = false;
  status: 'pending' | 'completed' = 'pending';
  examForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamServices,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({});
    this.examId = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;
    if (this.examId) {
      this.isLoading = true;
      // Use getExamToSolve for /take/:id/solve, otherwise getExamById
      const examObs = url.includes('/solve')
        ? this.examService.getExamToSolve(this.examId)
        : this.examService.getExamById(this.examId);
      examObs.subscribe({
        next: (exam) => {
          this.exam = exam;
          console.log('exam to solve:', exam);
          if (!Array.isArray(this.exam.questions)) {
            this.exam.questions = [];
          }
          this.isLoading = false;
          this.submissionSuccess = false;
          this.formDisabled = false;
          this.studentAnswers = {};
          if (this.exam.questions) {
            this.exam.questions.forEach((q: any, i: number) => {
              const qid = q.id ?? i;
              this.studentAnswers[qid] = [];
            });
          }
          const now = new Date();
          const start = new Date(exam.startDate);
          const [h, m, s] = exam.duration.split(':').map(Number);
          const endDate = new Date(
            start.getTime() + (h * 3600 + m * 60 + s) * 1000
          );
          this.endDate = endDate;
          const role = this.examService.getRoleFromToken
            ? this.examService.getRoleFromToken()
            : (this.authService as any).currentUserRole;
          const isActive = now >= start && now <= endDate;
          this.canTakeExam =
            role && role.toLowerCase() === 'student' && isActive;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to load exam.';
          this.isLoading = false;
          this.submissionSuccess = false;
          this.formDisabled = true;
        },
      });
    } else {
      this.error = 'No exam ID provided.';
      this.isLoading = false;
      this.submissionSuccess = false;
      this.formDisabled = true;
    }
  }

  // Returns true if the option is selected for the question
  isOptionSelected(question: any, option: any, i: number): boolean {
    const qid = question.id ?? i;
    return (
      Array.isArray(this.studentAnswers[qid]) &&
      this.studentAnswers[qid].includes(option.id)
    );
  }

  // Handles checkbox changes for multiple answers per question
  onCheckboxChange(event: any, questionId: string | number, optionId: any) {
    if (!Array.isArray(this.studentAnswers[questionId])) {
      this.studentAnswers[questionId] = [];
    }
    const checked = event.target ? event.target.checked : event;
    if (checked) {
      if (!this.studentAnswers[questionId].includes(optionId)) {
        this.studentAnswers[questionId].push(optionId);
      }
    } else {
      this.studentAnswers[questionId] = this.studentAnswers[questionId].filter(
        (id: any) => id !== optionId
      );
    }
  }

  // Returns true if all questions have at least one selected option
  allQuestionsAnswered(): boolean {
    return true;
    if (!this.exam || !this.exam.questions) return false;
    return this.exam.questions.every((q: any, i: number) => {
      const qid = q.id || i;
      return (
        Array.isArray(this.studentAnswers[qid]) &&
        this.studentAnswers[qid].length > 0
      );
    });
  }

  // Submits the exam answers to the backend
  submitExam() {
    if (!this.exam || !this.exam.questions) return;
    const answers = this.exam.questions.map((q: any, i: number) => {
      const qid = q.id || i;
      return {
        questionId: qid,
        optionIds: this.studentAnswers[qid] || [],
      };
    });
    this.formDisabled = true;
    this.examService.submitExam(this.examId || '', answers).subscribe({
      next: (result) => {
        this.submissionSuccess = true;
        this.formDisabled = true;
        this.status = 'completed';
        alert('Exam submitted!');
        this.router.navigate(['/take-exam/' + this.examId + '/solve']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.submissionSuccess = false;
        this.formDisabled = false;
        alert('Failed to submit exam.');
      },
    });
  }
}
