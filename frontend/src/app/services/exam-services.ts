import { Injectable } from '@angular/core';
import { nextTick } from 'process';
import { Observable } from 'rxjs';
import { IExam } from '../models/iexam';
import { observeNotification } from 'rxjs/internal/Notification';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamServices {
  Exam!:IExam;
    Exams : IExam[] = [];
  // baseURL:string="http://localhost:3000/exams";
  baseURL:string="http://localhost:7251/api/Exam/";
  token: string | null;
  headers!: HttpHeaders;
    constructor(private http:HttpClient){
      // this.token = localStorage.getItem('token');
      this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDkyYzBmNi0zZGQyLTQ4NDUtYTYwNi1jOWU0NGQ0ZmQ5ZWEiLCJlbWFpbCI6InRlYWNoZXIxQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVGVhY2hlciIsImV4cCI6MTc1MjA4MTU2MX0.F0aTSMEzvetO2WGykqcgGqzWvAY35Dzy03uUCJOBdhQ";
      this.headers=new HttpHeaders({Authorization:'Bearer '+this.token});
    }
   
  getExams():Observable<IExam[]>{
    return this.http.get<any>(this.baseURL,{headers:this.headers});
  }
  getExamById(examId:string){
    let url = `${this.baseURL}/${examId}`
    console.log(url);
    return this.http.get<any>(`${this.baseURL}${examId}`,{headers:this.headers});
  }
  addExam(exam:any) : Observable<IExam>{
    return this.http.post<IExam>(this.baseURL,exam,{headers:this.headers});

  }
  updateExam(examId:any, exam:any){
    return this.http.put(`${this.baseURL}/${examId}`,exam,{headers:this.headers});

  }
  deleteExam(examId:any):Observable<IExam> {
    return this.http.delete<IExam>(`${this.baseURL}/${examId}`,{headers:this.headers});
  }
}
