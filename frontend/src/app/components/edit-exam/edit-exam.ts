import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExam, IQuestion, IOption } from '../../models/iexam';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ isEditMode ? 'Edit Exam' : 'Create New Exam' }}</h2>
      <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
        <div class="card mb-3">
          <div class="card-header">Basic Information</div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input type="text" class="form-control" id="title" formControlName="title">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="courseId" class="form-label">Course ID</label>
                  <input type="number" class="form-control" id="courseId" formControlName="courseId">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input type="datetime-local" class="form-control" id="startDate" formControlName="startDate">
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="duration" class="form-label">Duration (minutes)</label>
                  <input type="number" class="form-control" id="duration" formControlName="duration">
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="maxDegree" class="form-label">Max Degree</label>
                  <input type="number" class="form-control" id="maxDegree" formControlName="maxDegree">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="minDegree" class="form-label">Min Degree</label>
                  <input type="number" class="form-control" id="minDegree" formControlName="minDegree">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header d-flex justify-content-between align-items-center">
            Questions
            <button type="button" class="btn btn-primary btn-sm" (click)="addQuestion()">Add Question</button>
          </div>
          <div class="card-body">
            <div formArrayName="questions">
              <div *ngFor="let question of questionsArray.controls; let i = index" [formGroupName]="i" class="border p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6>Question {{ i + 1 }}</h6>
                  <button type="button" class="btn btn-danger btn-sm" (click)="removeQuestion(i)">Remove</button>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label class="form-label">Question Title</label>
                      <input type="text" class="form-control" formControlName="title">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Degree</label>
                      <input type="number" class="form-control" formControlName="degree">
                    </div>
                  </div>
                </div>
                <div formArrayName="options">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label">Options</label>
                    <button type="button" class="btn btn-secondary btn-sm" (click)="addOption(i)">Add Option</button>
                  </div>
                  <div *ngFor="let option of getOptionsArray(i).controls; let j = index" [formGroupName]="j" class="row mb-2">
                    <div class="col-md-6">
                      <input type="text" class="form-control" placeholder="Option text" formControlName="title">
                    </div>
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" formControlName="isCorrect">
                        <label class="form-check-label">Correct</label>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <button type="button" class="btn btn-outline-danger btn-sm" (click)="removeOption(i, j)">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="examForm.invalid || loading">
            {{ loading ? 'Saving...' : (isEditMode ? 'Update Exam' : 'Create Exam') }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class EditExamComponent implements OnInit {
  examForm: FormGroup;
  isEditMode = false;
  loading = false;
  examId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamServices,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      courseId: [0, [Validators.required, Validators.min(1)]],
      maxDegree: [0, [Validators.required, Validators.min(1)]],
      minDegree: [0, [Validators.required, Validators.min(0)]],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.examId;
    
    if (this.isEditMode && this.examId) {
      this.loadExam();
    } else {
      this.addQuestion(); // Add one empty question for new exam
    }
  }

  get questionsArray() {
    return this.examForm.get('questions') as FormArray;
  }

  getOptionsArray(questionIndex: number) {
    return this.questionsArray.at(questionIndex).get('options') as FormArray;
  }

  addQuestion() {
    const question = this.fb.group({
      title: ['', Validators.required],
      degree: [0, [Validators.required, Validators.min(1)]],
      options: this.fb.array([])
    });
    this.questionsArray.push(question);
    this.addOption(this.questionsArray.length - 1); // Add one option by default
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  addOption(questionIndex: number) {
    const option = this.fb.group({
      title: ['', Validators.required],
      isCorrect: [false]
    });
    this.getOptionsArray(questionIndex).push(option);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptionsArray(questionIndex).removeAt(optionIndex);
  }

  loadExam() {
    if (!this.examId) return;
    
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        this.examForm.patchValue({
          title: exam.title,
          startDate: this.formatDateForInput(exam.startDate),
          duration: this.parseDuration(exam.duration),
          courseId: exam.courseId,
          maxDegree: exam.maxDegree,
          minDegree: exam.minDegree
        });

        // Clear existing questions and add loaded ones
        while (this.questionsArray.length !== 0) {
          this.questionsArray.removeAt(0);
        }

        exam.questions.forEach(q => {
          const question = this.fb.group({
            title: [q.title, Validators.required],
            degree: [q.degree, [Validators.required, Validators.min(1)]],
            options: this.fb.array([])
          });

          q.options.forEach(o => {
            const option = this.fb.group({
              title: [o.title, Validators.required],
              isCorrect: [o.isCorrect || false]
            });
            (question.get('options') as FormArray).push(option);
          });

          this.questionsArray.push(question);
        });
      },
      error: (err) => {
        console.error('Error loading exam:', err);
      }
    });
  }

  onSubmit() {
    if (this.examForm.invalid) return;

    this.loading = true;
    const formValue = this.examForm.value;

    const examData: IExam = {
      id: this.isEditMode ? parseInt(this.examId!) : undefined,
      title: formValue.title,
      startDate: new Date(formValue.startDate),
      duration: this.formatDuration(formValue.duration),
      courseId: formValue.courseId,
      maxDegree: formValue.maxDegree,
      minDegree: formValue.minDegree,
      questions: formValue.questions.map((q: any) => ({
        id: undefined,
        title: q.title,
        degree: q.degree,
        options: q.options.map((o: any) => ({
          id: undefined,
          title: o.title,
          isCorrect: o.isCorrect,
          isChoosedByStudent: false
        }))
      }))
    };

    const request = this.isEditMode 
      ? this.examService.updateExam(examData)
      : this.examService.addExam(examData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving exam:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/exams']);
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  private parseDuration(duration: string): number {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  }
} 