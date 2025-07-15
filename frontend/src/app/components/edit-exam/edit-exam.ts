import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExam, IQuestion, IOption } from '../../models/iexam';
import { BackendService } from '../../services/Teacher-service';
import { ICourses } from '../../models/ICourses';
import { Course } from '../../models/course';
import { formatISO } from 'date-fns';

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
                <!-- @if(isEditMode){
Id:
                <div class="mb-3">
                  <input type="number" class="form-control" id="Id" formControlName="id">
                </div>
              } -->
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    formControlName="title"
                  />
                </div>
              </div>

              @if(!isEditMode){
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="courseId" class="form-label">Course</label>
                  <select
                    id="courseId"
                    class="form-select"
                    formControlName="courseId"
                  >
                    <option value="0">— Select a course —</option>
                    <option
                      *ngFor="let course of courses"
                      [value]="course.CourseId"
                    >
                      {{ course.CourseName }}
                    </option>
                  </select>
                </div>
              </div>
              }
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="startDate"
                    formControlName="startDate"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="duration" class="form-label"
                    >Duration (minutes)</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="duration"
                    formControlName="duration"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="maxDegree" class="form-label">Max Degree</label>
                  <input
                    type="number"
                    class="form-control"
                    id="maxDegree"
                    formControlName="maxDegree"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="minDegree" class="form-label">Min Degree</label>
                  <input
                    type="number"
                    class="form-control"
                    id="minDegree"
                    formControlName="minDegree"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            Questions
            <button
              type="button"
              class="btn btn-primary btn-sm"
              (click)="addQuestion()"
            >
              Add Question
            </button>
          </div>
          <div class="card-body">
            <div formArrayName="questions">
              <div
                *ngFor="let question of questionsArray.controls; let i = index"
                [formGroupName]="i"
                class="border p-3 mb-3"
              >
                <div
                  class="d-flex justify-content-between align-items-center mb-2"
                >
                  <h6>Question {{ i + 1 }}</h6>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    (click)="removeQuestion(i)"
                  >
                    Remove
                  </button>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label class="form-label">Question Title</label>

                      <input
                        type="text"
                        class="form-control"
                        formControlName="title"
                      />
                      <!-- QuestioID: <input type="text" class="form-control" formControlName="id"> -->
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Degree</label>
                      <input
                        type="number"
                        class="form-control"
                        formControlName="degree"
                      />
                    </div>
                  </div>
                </div>
                <div formArrayName="options">
                  <div
                    class="d-flex justify-content-between align-items-center mb-2"
                  >
                    <label class="form-label">Options</label>
                    <button
                      type="button"
                      class="btn btn-secondary btn-sm"
                      (click)="addOption(i)"
                    >
                      Add Option
                    </button>
                  </div>
                  <div
                    *ngFor="
                      let option of getOptionsArray(i).controls;
                      let j = index
                    "
                    [formGroupName]="j"
                    class="row mb-2 align-items-center"
                  >
                    <!-- <div class="col-md-2">
                      <span *ngIf="option.get('id')?.value">optionId: {{ option.get('id')?.value }}</span>
                    </div> -->
                    <div class="col-md-4">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Option text"
                        formControlName="title"
                      />
                    </div>
                    <div class="col-md-2">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          formControlName="isCorrect"
                        />
                        <label class="form-check-label">Correct</label>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        (click)="removeOption(i, j)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="examForm.invalid || loading"
          >
            {{
              loading ? 'Saving...' : isEditMode ? 'Update Exam' : 'Create Exam'
            }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EditExamComponent implements OnInit {
  examForm: FormGroup;
  isEditMode = false;
  loading = false;
  examId: string | null = null;
  courses: Course[] = [];
  constructor(
    private fb: FormBuilder,
    private examService: ExamServices,
    private teacherService: BackendService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.examForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      courseId: [0],
      maxDegree: [0, [Validators.required, Validators.min(1)]],
      minDegree: [0, [Validators.required, Validators.min(0)]],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');

    // Check if we're in edit mode: id should exist and not be '0' or 'new'
    this.isEditMode = !!(
      this.examId &&
      this.examId !== '0' &&
      this.examId !== 'new'
    );
    this.teacherService.GetCourses().subscribe({
      next: (resp) => {
        this.courses = resp.map((course: any) => ({
          CourseId: course.id,
          CourseName: course.name,
          teacherId: course.teacherId,
        }));
        this.cdr.detectChanges();
        console.log('courses:', this.courses);
      },
      error: (e) => {
        console.log(e);
      },
    });
    console.log('Exam ID from route:', this.examId);
    console.log('Is edit mode:', this.isEditMode);

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
      options: this.fb.array([]),
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
      isCorrect: [false],
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
          id: exam.id,
          title: exam.title,
          startDate: this.formatDateForInput(exam.startDate),
          duration: this.parseDuration(exam.duration),
          courseId: exam.courseId,
          maxDegree: exam.maxDegree,
          minDegree: exam.minDegree,
        });

        // Clear existing questions and add loaded ones
        while (this.questionsArray.length !== 0) {
          this.questionsArray.removeAt(0);
        }

        exam.questions.forEach((q) => {
          const question = this.fb.group({
            id: [q.id],
            title: [q.title, Validators.required],
            degree: [q.degree, [Validators.required, Validators.min(1)]],
            options: this.fb.array([]),
          });

          q.options.forEach((o) => {
            const option = this.fb.group({
              id: [o.id],
              title: [o.title, Validators.required],
              isCorrect: [o.isCorrect || false],
            });
            (question.get('options') as FormArray).push(option);
          });

          this.questionsArray.push(question);
        });
      },
      error: (err) => {
        console.error('Error loading exam:', err);
      },
    });
  }

  onSubmit() {
    if (this.examForm.invalid) return;

    this.loading = true;
    const formValue = this.examForm.value;
    console.log('start data:', formValue.startDate);
    console.log(
      'start data:',
      formatISO(new Date(formValue.startDate).toISOString())
    );
    // Ensure all required fields and IDs for edit
    const examData: IExam = {
      ...(this.isEditMode && this.examId ? { id: parseInt(this.examId) } : {}),
      title: formValue.title,
      startDate: formatISO(new Date(formValue.startDate).toISOString()),
      duration: this.formatDuration(formValue.duration),
      courseId: Number(formValue.courseId),
      maxDegree: Number(formValue.maxDegree),
      minDegree: Number(formValue.minDegree),
      questions: formValue.questions.map((q: any, idx: number) => ({
        id: q.id ?? undefined,
        title: q.title,
        degree: Number(q.degree),
        options: q.options.map((o: any, oidx: number) => ({
          id: o.id ?? undefined,
          title: o.title,
          isCorrect: !!o.isCorrect,
          isChoosedByStudent: false,
        })),
      })),
    };

    console.log('Submitting exam data:', examData);
    console.log('Is edit mode:', this.isEditMode);

    const request = this.isEditMode
      ? this.examService.updateExam(examData)
      : this.examService.addExam(examData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Success response:', response);
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving exam:', err);
        if (err.status === 400) {
          alert('Invalid data. Please check your input.');
        } else if (err.status === 401) {
          alert('Unauthorized. Please log in again.');
        } else {
          alert('Error saving exam. Please try again.');
        }
      },
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
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:00`;
  }
}
