import { Component, OnInit } from '@angular/core';
import { StaticExamServices } from '../../services/static-exam-services';
import { IExam } from '../../models/iexam';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exams',
  imports: [RouterLink],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class Exams implements OnInit{
  Exams: IExam[]=[];
  constructor(private ExamServices:StaticExamServices){
    
  }
  ngOnInit(): void {
    this.Exams = this.ExamServices.getAllProducts();
  }
  
}
