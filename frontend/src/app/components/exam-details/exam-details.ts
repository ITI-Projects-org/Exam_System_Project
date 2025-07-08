import { IpcNetConnectOpts } from 'net';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IExam } from '../../models/iexam';
import { StaticExamServices } from '../../services/static-exam-services';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exam-details',
  imports: [RouterLink],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css'
})
export class ExamDetails implements OnInit{
  Exam !: IExam ;
  mySub!:Subscription;
  Id! : string | null;
    constructor(private ExamService: StaticExamServices,private ExamTest:ExamServices, private activatedRoute:ActivatedRoute, private cdr:ChangeDetectorRef){
    
  }

  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id')??'';
    this.mySub = this.ExamTest.getExamById(this.Id).subscribe({
      next: (exams) => {
        if (Array.isArray(exams)) 
          this.Exam = exams[0];
         else 
          this.Exam = exams;
        this.cdr.detectChanges();
      }
    });
  }
  
}
