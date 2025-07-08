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
          this.getTitle.setValue(this.exam.title ?? '');
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

  handel_Edit_Add_Exam(examForm: FormGroup): any {
    console.log('form status:', examForm.status);
    
    // Log validation errors for each field
    Object.keys(examForm.controls).forEach(key => {
      const control = examForm.get(key);
      if (control && control.invalid) {
        console.log(`${key} is invalid:`, control.errors);
        console.log(`${key} value:`, control.value);
      }
    });
    
    if (examForm.status != 'VALID') return;
    if (this.examId == '0') this.AddExam(examForm);
    else this.EditExam(examForm, this.examId)
  }

  AddExam(examForm: FormGroup) {
    console.log('adding exam');
    const formData = examForm.value;

    // Convert duration to TimeSpan format (HH:mm:ss)
    if (formData.duration) {
      const hours = Math.floor(formData.duration);
      const minutes = Math.floor((formData.duration - hours) * 60);
      formData.duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }

    // Convert camelCase to PascalCase for backend compatibility
    const examDataForBackend = {
      id: formData.id,
      title: formData.title,
      startDate: formData.startDate,
      duration: formData.duration,
      courseId: formData.courseId,
      maxDegree: formData.maxDegree,
      minDegree: formData.minDegree,
      teacherId: formData.teacherId,
      questions: formData.questions?.map((q: any) => ({
        id: q.id,
        title: q.title,
        degree: q.degree,
        options: q.options?.map((opt: any) => ({
          id: opt.id,
          title: opt.title,
          isCorrect: opt.isCorrect,
          isChoosedByStudent: opt.isChoosedByStudent
        })) || []
      })) || []
    };

    // Wrap in examDTO object as expected by backend
    const examDTO = { examDTO: examDataForBackend };

    console.log('Sending exam data:', examDTO);
    console.log('Exam data for backend:', examDataForBackend);
    console.log('Title value being sent:', examDataForBackend.title);
    this.ExamTestServices.addExam(examDTO).subscribe({
      next: () => {
        this.router.navigate(['/exams'])
      },
      error: (error) => {
        console.error(' Backend validation errors:', error.error?.errors);
        console.error(' Title validation error details:', error.error?.errors?.Title);
        console.error(' Full error response:', error);
      }
    })
  }
  EditExam(examForm: FormGroup, examId: string) {
    const formData = examForm.value;

    // Convert duration to TimeSpan format (HH:mm:ss)
    if (formData.duration) {
      const hours = Math.floor(formData.duration);
      const minutes = Math.floor((formData.duration - hours) * 60);
      formData.duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }

    // Convert camelCase to PascalCase for backend compatibility
    const examDataForBackend = {
      Id: formData.id,
      Title: formData.title,
      StartDate: formData.startDate,
      Duration: formData.duration,
      CourseId: formData.courseId,
      MaxDegree: formData.maxDegree,
      MinDegree: formData.minDegree,
      TeacherId: formData.teacherId,
      Questions: formData.questions?.map((q: any) => ({
        Id: q.id,
        Title: q.title,
        Degree: q.degree,
        Options: q.options?.map((opt: any) => ({
          Id: opt.id,
          Title: opt.title,
          IsCorrect: opt.isCorrect,
          IsChoosedByStudent: opt.isChoosedByStudent
        })) || []
      })) || []
    };

    // Wrap in examDTO object as expected by backend
    const examDTO = { examDTO: examDataForBackend };

    this.ExamTestServices.updateExam(this.examId, examDTO).subscribe({
      next: () => {
        this.router.navigate(['/exams'])
      },
      error: (error) => {
        console.error(' Backend validation errors:', error.error?.errors);
        console.error(' Title validation error details:', error.error?.errors?.Title);
        console.error(' Full error response:', error);
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