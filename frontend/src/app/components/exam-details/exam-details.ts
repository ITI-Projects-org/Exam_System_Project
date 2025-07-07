import { Component, OnInit } from '@angular/core';
import { IExam } from '../../models/iexam';
import { StaticExamServices } from '../../services/static-exam-services';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-exam-details',
  imports: [RouterLink],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css'
})
export class ExamDetails implements OnInit{
  Exam !: IExam | undefined;
  Id! : string | null;
    constructor(private ExamService: StaticExamServices, private activatedRoute:ActivatedRoute){
    
  }

  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id')??'';
    this.Exam = this.ExamService.getExamById(this.Id??'');
  }
  
}
