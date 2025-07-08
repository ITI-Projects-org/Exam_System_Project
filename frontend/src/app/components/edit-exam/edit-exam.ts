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
    this.examForm = this.fb.group({
      Id: [this.examId],
      Title: ['', [Validators.required, Validators.minLength(3)]],
      MaxDegree: [0, [Validators.required]],
      MinDegree: [0, Validators.required],
      StartDate:[new Date().toISOString().split('T')[0]],
      Duration:[2],
      CourseId :[0, Validators.required],
      TeacherId:[0],
      questions: this.fb.array([])
    })
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

  handel_Edit_Add_Exam(examForm:FormGroup):any{
    if(this.examForm.status != 'VALID') {
        console.log(this.examForm.status)
      return 
    } ;
    console.log('adding exam') 
    if(this.examId == '0') this.AddExam(examForm);  
    else this.EditExam(examForm, this.examId)
  }

  AddExam(examForm:FormGroup){
    this.ExamTestServices.addExam(examForm.value).subscribe({
      next:()=>{
        this.router.navigate(['/exams'])
      }
    })
  }
  EditExam(examForm:FormGroup,examId:string){
    this.ExamTestServices.updateExam (this.examId,this.examForm.value).subscribe({
      next:()=>{
        this.router.navigate(['/exams'])
      }
    })
  }

get getTitle(){
  return this.examForm.controls['Title'];
}
  get getMaxDegree(){
  return this.examForm.controls['MaxDegree'];
}
  get getMinDegree(){
  return this.examForm.controls['MinDegree'];
}
get getStartDate(){
  return this.examForm.controls['StartDate'];
}
get getDuration(){
  return this.examForm.controls['Duration'];
}
get getCourseId(){
  return this.examForm.controls['CourseId'];
}
get getTeacherId(){
  return this.examForm.controls['TeacherId'];
}
}