import { Injectable } from '@angular/core';
import { nextTick } from 'process';
import { Observable } from 'rxjs';
import { IExam } from '../models/iexam';
import { observeNotification } from 'rxjs/internal/Notification';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamServices {

  // constructor() { }
  // ads:string[]=[
  //   'str-1',
  //   'str-2',
  //   'str-3',
  // ];
  // getAds(): Observable<string>{
    
  //   let myObservable = new Observable<string>((observable)=>{
  //     {
  //       let count = 0;
  //       setInterval(()=>{
  //         observable.next(this.ads[count++])
  //         if(this.ads.length == count){
  //           observable.complete();
  //         }
  //       },1000);
  //     }
  //   });
  //   return myObservable;
  // }
  Exam!:IExam;
    Exams : IExam[] = [];
  baseURL:string="http://localhost:3000/exams";
    constructor(private http:HttpClient){
      // this.Exams = [
      //   {
      //     Id: "1",
      //     Title: "exam-1",
      //     MaxDegree: 100,
      //     MinDegree: 50,
      //     StartDate: new Date('1-1-2025'),
      //     Duration: 1,
      //     CourseId: 1,
      //     TeacherId: 1
      //   },
      //   {
      //     Id: "2",
      //     Title: "exam-2",
      //     MaxDegree: 120,
      //     MinDegree: 60,
      //     StartDate: new Date('2-2-2025'),
      //     Duration: 2,
      //     CourseId: 1,
      //     TeacherId: 2
      //   }
      // ];
    }
    // getExams(){
    //   let ExamObservable = new Observable<IExam>((Observable)=>{
    //   let count = 0;
    //   setInterval(()=>{
    //     Observable.next(this.Exams[count++]);
    //     if(count == this.Exams.length)
    //       Observable.complete();

    //   },1000)
    //   })
    //   return ExamObservable;
    // }
    getExams():Observable<IExam[]>{
      return this.http.get<IExam[]>(this.baseURL);
    }
    getExamById(examId:string){
      let url = `${this.baseURL}/${examId}`
      console.log(url);
      return this.http.get<IExam[]>(`${this.baseURL}/${examId}`);
  }
  addExam(exam:any):Observable<IExam>{
    return this.http.post<IExam>(this.baseURL,exam);
  }
  updateExam(examId:any, exam:any){
    return this.http.put(`${this.baseURL}/${examId}`,exam);

  }
  deleteExam(examId:any):Observable<IExam> {
    return this.http.delete<IExam>(`${this.baseURL}/${examId}`);
  }
}
