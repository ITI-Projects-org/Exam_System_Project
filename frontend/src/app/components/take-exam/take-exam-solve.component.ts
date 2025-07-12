import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { AuthService } from '../../services/auth-service';
import { IExam } from '../../models/iexam';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-take-exam-solve',
  templateUrl: './take-exam-solve.component.html',
  styleUrls: ['./take-exam-solve.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TakeExamSolveComponent implements OnInit {
  examId: string | null = null;
  exam: IExam | null = null;
  isStudent = false;
  isActive = false;
  submitted = false;
  degree: number | null = null;
  error: string | null = null;
  isLoading = true;
  results: any[] = [];
  totalQuestions = 0;
  correctAnswers = 0;
  percentage = 0;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamServices,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('TakeExamSolveComponent ngOnInit called');
    this.examId = this.route.snapshot.paramMap.get('id');
    console.log('Exam ID from route:', this.examId);
    this.isStudent = this.authService.getUserRole() === 'Student';
    if (this.examId) {
      this.isLoading = true;
      // Use getExamToSolve for /solve route
      console.log('Loading exam results for ID:', this.examId);
      this.examService.getExamToSolve(this.examId).subscribe({
        next: (exam) => {
          console.log('Exam data received:', exam);
          this.exam = exam;
          // Try different property names for degree
          this.degree = exam.StudDegree || exam.degree || exam.studDegree || exam.studentDegree || null;
          console.log('Degree found:', this.degree);
          this.submitted = true;
          
          // Calculate statistics
          console.log('Exam questions:', this.exam?.questions);
          if (this.exam && this.exam.questions) {
            this.totalQuestions = this.exam.questions.length;
            this.correctAnswers = this.exam.questions.filter((q: any) => 
              q.options?.some((opt: any) => opt.isChoosedByStudent && opt.isCorrect)
            ).length;
            this.percentage = this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
            
            // Mark chosen and correct answers for display
            for (const q of this.exam.questions) {
              for (const opt of q.options) {
                // Mark if this option was chosen by the student
                opt.isChoosedByStudent = !!opt.isChoosedByStudent;
                // Mark if this option is correct
                opt.isCorrect = !!opt.isCorrect;
              }
            }
          }
          
          this.isLoading = false;
          console.log('Final state - isLoading:', this.isLoading, 'exam:', !!this.exam, 'error:', this.error);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading exam results:', err);
          this.error = 'Failed to load solved exam.';
          this.isLoading = false;
        },
      });
    } else {
      this.error = 'No exam ID provided.';
      this.isLoading = false;
    }
    this.cdr.detectChanges();
  }



  getStudentAnswers(question: any) {
    if (!question || !question.options) return [];
    return question.options.filter((o: any) => o.isChoosedByStudent);
  }

  isQuestionCorrect(question: any): boolean {
    if (!question || !question.options) return false;
    return question.options.some((opt: any) => opt.isChoosedByStudent && opt.isCorrect);
  }

  goBack() {
    this.router.navigate(['/exams']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
