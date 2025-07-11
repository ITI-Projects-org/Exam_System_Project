import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { AuthService } from '../../services/auth-service';
import { IExam } from '../../models/iexam';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-take-exam-solve',
  templateUrl: './take-exam-solve.component.html',
  styleUrls: ['./take-exam-solve.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.isStudent = this.authService.getUserRole() === 'Student';
    if (this.examId) {
      // Use getExamToSolve for /solve route
      this.examService.getExamToSolve(this.examId).subscribe({
        next: (exam) => {
          this.exam = exam;
          this.degree = exam.degree || exam.studDegree || null;
          this.submitted = true;
          // Mark chosen and correct answers for display
          if (this.exam && this.exam.questions) {
            for (const q of this.exam.questions) {
              for (const opt of q.options) {
                // Mark if this option was chosen by the student
                opt.isChoosedByStudent = !!opt.isChoosedByStudent;
                // Mark if this option is correct
                opt.isCorrect = !!opt.isCorrect;
              }
            }
          }
        },
        error: (err) => {
          this.error = 'Failed to load solved exam.';
        },
      });
    } else {
      this.error = 'No exam ID provided.';
    }
  }

  submitExam(answers: any) {
    // Transform answers to backend format if needed
    // Example: { q1: 'answer1', q2: 'answer2' } => [{ questionId: 1, answer: 'answer1' }, ...]
    const formattedAnswers = Object.keys(answers).map((key) => {
      const questionId = Number(key.replace('q', ''));
      return { questionId, answer: answers[key] };
    });
    this.examService.submitExam(this.examId!, formattedAnswers).subscribe({
      next: (result) => {
        this.degree = result.degree;
        this.submitted = true;
        // Mark chosen options for display
        if (this.exam && result.answers) {
          for (const ans of result.answers) {
            const q = this.exam.questions.find((q) => q.id === ans.questionId);
            if (q) {
              for (const opt of q.options) {
                opt.isChoosedByStudent =
                  opt.id === ans.answer ||
                  (Array.isArray(ans.answer) && ans.answer.includes(opt.id));
              }
            }
          }
        }
      },
      error: (err) => {
        this.error = 'Failed to submit exam.';
      },
    });
  }

  getStudentAnswers(question: any) {
    if (!question || !question.options) return [];
    return question.options.filter((o: any) => o.isChoosedByStudent);
  }
}
