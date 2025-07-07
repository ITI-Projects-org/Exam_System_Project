import { IpcNetConnectOpts } from 'net';
import { IExam } from '../models/iexam';
import { ExamCard } from './../components/exam-card/exam-card';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class  StaticExamServices{
  Exam!:IExam;
  Exams : IExam[] = [];
  constructor(){
    this.Exams = [
      {
        Id: "1",
        Title: "exam-1",
        MaxDegree: 100,
        MinDegree: 50,
        StartDate: new Date('1-1-2025'),
        Duration: 1,
        CourseId: 1,
        TeacherId: 1
      },
      {
        Id: "2",
        Title: "exam-2",
        MaxDegree: 120,
        MinDegree: 60,
        StartDate: new Date('2-2-2025'),
        Duration: 2,
        CourseId: 1,
        TeacherId: 2
      }

    ];
  }
  getAllProducts():IExam[]{
    return this.Exams;
  }

  getExamById(ExamId:string):IExam|undefined{
    return this.Exams.find(e=>e.Id == ExamId) ;
  }
  addExam(ExamForm:FormData):FormData{
    // this.Exam.CourseId = ExamForm;
    this.Exams.push(this.Exam);
    return ExamForm;
  }

}