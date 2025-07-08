import { IpcNetConnectOpts } from 'net';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { exhaustMap, pipe, Subscription } from 'rxjs';
import {CommonModule} from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { IExam } from '../../models/iexam';

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
  
  constructor(
    private ExamTestServices:ExamServices ,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef){}
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
          console.log('edited exam'+this.exam)
          this.getCourseId.setValue(this.exam.CourseId ?? 0);
          this.getTitle.setValue(this.exam.Title ?? '');
          this.getMaxDegree.setValue(this.exam.MaxDegree ?? 0);
          this.getMinDegree.setValue(this.exam.MinDegree ?? 0);
          this.getDuration.setValue(this.exam.Duration ?? 0);
          this.cdr.detectChanges();
  
      }
    })
      }
    });
    
  }

  examForm = new FormGroup({
    Id: new FormControl(''),
    Title:new FormControl('',[Validators.required,Validators.minLength(3)]),
    MaxDegree:new FormControl(0,[Validators.required,Validators.min(1)]),
    MinDegree:new FormControl(0,[Validators.min(0)]),
    StartDate: new FormControl(0,[Validators.required]),
    Duration: new FormControl(0,[Validators.required]),
    CourseId : new FormControl(0,[Validators.required]),
    TeacherId: new FormControl(0)

  })
  


  handel_Edit_Add_Exam(examForm:FormGroup):any{
    if(this.examForm.status != 'VALID') return ;
    if(this.examId == '0') this.AddExam(examForm);  
    else this.EditExam(examForm, this.examId)
  }

  AddExam(examForm:FormGroup){
    this.ExamTestServices.addExam(examForm.value).subscribe({
      next:()=>{
        console.log('from Add Funtion');
       this.router.navigate(['/exams'])
      }
    })
  }
    EditExam(examForm:FormGroup,examId:string){
      console.log('edited exam ' + examId);
      this.ExamTestServices.updateExam (this.examId,this.examForm.value).subscribe({
        next:()=>{
          console.log('from Edit Funtion')  ;
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
}