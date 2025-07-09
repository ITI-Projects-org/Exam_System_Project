import { IpcNetConnectOpts } from 'net';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { exhaustMap, pipe, Subscription } from 'rxjs';
import {CommonModule} from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExam, IQuestion, IOption } from '../../models/iexam';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-exam.html',
  styleUrls: ['./edit-exam.css']
})
export class EditExam implements OnInit, OnDestroy{
  examId!:string;
  exam!:IExam;
  examForm!:FormGroup;
  formSubmitted = false;

  constructor(
    private ExamTestServices:ExamServices ,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb:FormBuilder
  ){}
  ngOnDestroy(): void {
    this.subActive.unsubscribe();
    this.subActive.unsubscribe();
  }

  subActive!:Subscription;
  getExamSub !:Subscription
  ngOnInit(): void {
 

    this.examForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      maxDegree: [100, [Validators.required, Validators.min(1)]],
      minDegree: [0, Validators.min(0)],
      startDate: [new Date().toISOString().slice(0, 16), Validators.required],
      duration: [2, Validators.required],
      courseId: [1, Validators.required],
      teacherId: [1],
      questions: this.fb.array([])
    })

    this.subActive = this.activatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.examId = params.get('id')!;
        if(this.examId=='0') return;
        this.getExamSub =  this.ExamTestServices.getExamById(this.examId).subscribe({
        next:(res)=>{
          if(Array.isArray(res))
            this.exam = res[0];
          else
            this.exam = res;
          // Patch exam fields
          this.getCourseId.setValue(this.exam.courseId ?? 0);
          this.getTitle.setValue(this.exam.title || '');
          this.getMaxDegree.setValue(this.exam.maxDegree ?? 0);
          this.getMinDegree.setValue(this.exam.minDegree ?? 0);
          this.getDuration.setValue(this.exam.duration ?? 0);
          // Patch questions
          this.questions.clear();
          (this.exam.questions || []).forEach(q => {
            this.questions.push(this.createQuestionGroup(q));
          });
          this.cdr.detectChanges();
        }
      })
      }
    });
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  createQuestionGroup(q?: IQuestion): FormGroup {
    return this.fb.group({
      id: [q?.id || ''],
      title: [q?.title || '', Validators.required],
      degree: [q?.degree || 0, Validators.required],
      options: this.fb.array((q?.options || []).map(opt => this.createOptionGroup(opt)))
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getOptions(qIndex: number): FormArray {
    return (this.questions.at(qIndex).get('options') as FormArray);
  }

  createOptionGroup(opt?: IOption): FormGroup {
    return this.fb.group({
      id: [opt?.id || ''],
      title: [opt?.title || '', Validators.required],
      isCorrect: [opt?.isCorrect || false],
      isChoosedByStudent: [opt?.isChoosedByStudent || false]
    });
  }

  addOption(qIndex: number) {
    this.getOptions(qIndex).push(this.createOptionGroup());
  }

  removeOption(qIndex: number, oIndex: number) {
    this.getOptions(qIndex).removeAt(oIndex);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: any) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  handel_Edit_Add_Exam(examForm: FormGroup): any {
    this.formSubmitted = true;
    console.log('form status:', examForm.status);
    console.log('form value:', examForm.value);
    
    // Mark all form controls as touched to trigger validation display
    this.markFormGroupTouched(examForm);
    
    // Log validation errors for each field
    Object.keys(examForm.controls).forEach(key => {
      const control = examForm.get(key);
      if (control && control.invalid) {
        console.log(`${key} is invalid:`, control.errors);
        console.log(`${key} value:`, control.value);
        console.log(`${key} touched:`, control.touched);
        console.log(`${key} dirty:`, control.dirty);
      }
    });
    
    // Check if title field is specifically invalid
    const titleControl = examForm.get('title');
    if (titleControl && titleControl.invalid) {
      console.log('Title field errors:', titleControl.errors);
      console.log('Title field value:', titleControl.value);
      console.log('Title field touched:', titleControl.touched);
    }
    
    if (examForm.status != 'VALID') {
      console.log('Form is invalid, cannot submit');
      return;
    }
    if (this.examId == '0') this.AddExam(examForm);
    else this.EditExam(examForm, this.examId)
  }

  AddExam(examForm: FormGroup) {
    console.log('adding exam');
    const formData = examForm.value;

    // Convert duration to TimeSpan format (HH:mm:ss) as expected by backend
    let durationInMinutes = formData.duration;
    if (typeof durationInMinutes === 'string') {
      durationInMinutes = parseInt(durationInMinutes);
    }
    
    // Convert minutes to TimeSpan format (HH:mm:ss)
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const timeSpanString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    // Create ExamInputDTO structure exactly as expected by backend
    const examInputDTO = {
      Id: null, // null for new exam
      Title: formData.title,
      StartDate: new Date(formData.startDate).toISOString(), // Convert to ISO string
      Duration: timeSpanString, // Backend expects TimeSpan string format "HH:mm:ss"
      CourseId: parseInt(formData.courseId),
      MaxDegree: parseInt(formData.maxDegree),
      MinDegree: parseInt(formData.minDegree),
      IsAbsent: false, // Default value
      Stud_Options: [], // Empty array for new exam
      Questions: formData.questions?.map((q: any) => ({
        Id: q.id ? parseInt(q.id) : 0,
        Title: q.title,
        Degree: parseInt(q.degree),
        Options: q.options?.map((opt: any) => ({
          Id: opt.id ? parseInt(opt.id) : 0,
          Title: opt.title,
          IsCorrect: opt.isCorrect,
          IsChoosedByStudent: opt.isChoosedByStudent || false
        })) || []
      })) || [],
      StudDegree: 0 // Default value
    };

    // Wrap in examDTO object as expected by backend
    const examDTO = { examDTO: examInputDTO };

    console.log('Sending examDTO to backend for new exam:', examDTO);
    console.log('Duration being sent:', examInputDTO.Duration);
    this.ExamTestServices.addExam(examDTO).subscribe({
      next: (response) => {
        console.log('Exam added successfully:', response);
        this.router.navigate(['/exams'])
      },
      error: (error) => {
        console.error('Add exam error:', error);
        console.error('Backend validation errors:', error.error?.errors);
        console.error('Full error response:', error);
      }
    })
  }
  EditExam(examForm: FormGroup, examId: string) {
    const formData = examForm.value;

    // Convert duration to TimeSpan format (HH:mm:ss) as expected by backend
    let durationInMinutes = formData.duration;
    if (typeof durationInMinutes === 'string') {
      durationInMinutes = parseInt(durationInMinutes);
    }
    
    // Convert minutes to TimeSpan format (HH:mm:ss)
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const timeSpanString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    // Create ExamInputDTO structure exactly as expected by backend
    const examInputDTO = {
      Id: parseInt(examId), // Convert string to int
      Title: formData.title,
      StartDate: new Date(formData.startDate).toISOString(), // Convert to ISO string
      Duration: timeSpanString, // Backend expects TimeSpan string format "HH:mm:ss"
      CourseId: parseInt(formData.courseId),
      MaxDegree: parseInt(formData.maxDegree),
      MinDegree: parseInt(formData.minDegree),
      IsAbsent: false, // Default value
      Stud_Options: [], // Empty array as we're not handling student options in edit
      Questions: formData.questions?.map((q: any) => ({
        Id: q.id ? parseInt(q.id) : 0,
        Title: q.title,
        Degree: parseInt(q.degree),
        Options: q.options?.map((opt: any) => ({
          Id: opt.id ? parseInt(opt.id) : 0,
          Title: opt.title,
          IsCorrect: opt.isCorrect,
          IsChoosedByStudent: opt.isChoosedByStudent || false
        })) || []
      })) || [],
      StudDegree: 0 // Default value
    };

    // Wrap in examDTO object as expected by backend
    const examDTO = { examDTO: examInputDTO };

    console.log('Sending examDTO to backend:', examDTO);
    console.log('Exam ID being sent:', examInputDTO.Id);
    console.log('Duration being sent:', examInputDTO.Duration);

    this.ExamTestServices.updateExam(this.examId, examDTO).subscribe({
      next: (response) => {
        console.log('Exam updated successfully:', response);
        this.router.navigate(['/exams'])
      },
      error: (error) => {
        console.error('Update exam error:', error);
        console.error('Backend validation errors:', error.error?.errors);
        console.error('Full error response:', error);
      }
    })
  }

  get getTitle() {
    return this.examForm.controls['title'];
  }
  get getMaxDegree() {
    return this.examForm.controls['maxDegree'];
  }
  get getMinDegree() {
    return this.examForm.controls['minDegree'];
  }
  get getStartDate() {
    return this.examForm.controls['startDate'];
  }
  get getDuration() {
    return this.examForm.controls['duration'];
  }
  get getCourseId() {
    return this.examForm.controls['courseId'];
  }
  get getTeacherId() {
    return this.examForm.controls['teacherId'];
  }
}