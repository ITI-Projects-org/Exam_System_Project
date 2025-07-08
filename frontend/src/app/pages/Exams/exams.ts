import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { StaticExamServices } from '../../services/static-exam-services';
import { IExam } from '../../models/iexam';
import { RouterLink } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { Observable, Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-exams',
  imports: [RouterLink],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class Exams implements OnInit, OnDestroy{
  Exams: IExam[]=[];
  examObservable!: Subscription;
  mySubDel!: Subscription;
  ads:string[]=[];

    constructor(private ExamServices:StaticExamServices, private ExamTestServices:ExamServices, private cdr:ChangeDetectorRef){
  }
  ngOnDestroy(): void {
    this.examObservable.unsubscribe();
    
  }
  ngOnInit(): void {
    
     this.examObservable =this.ExamTestServices.getExams().subscribe({
      next:(exam)=>{
        this.Exams = exam;
    this.cdr.detectChanges();
      },
      complete:()=>{console.log('done');
      }
    }
    );
  }
  deleteExam(id:string):void{
    this.mySubDel = this.ExamTestServices.deleteExam(id).subscribe({
      next:(exam)=>{
        this.Exams.splice(this.Exams.indexOf(exam),1)
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.log(err);
        this.mySubDel.unsubscribe();

      },
      complete:()=>{this.mySubDel.unsubscribe();}
    });
  }  
}
