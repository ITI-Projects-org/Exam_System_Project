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
      this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDkyYzBmNi0zZGQyLTQ4NDUtYTYwNi1jOWU0NGQ0ZmQ5ZWEiLCJlbWFpbCI6InRlYWNoZXIxQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVGVhY2hlciIsImV4cCI6MTc1MjE1NDI2M30.4XEjrnbJAmOG534fpT8-QQ28_vlvdVaROGwshU0Hqy0";
      this.headers=new HttpHeaders({Authorization:'Bearer '+this.token});
    }
   
  getExams():Observable<IExam[]>{
    return this.http.get<any>(this.baseURL,{headers:this.headers});
  }
  getExamById(examId:string){
    let url = `${this.baseURL}${examId}`
    console.log(url);
    return this.http.get<any>(`${this.baseURL}${examId}`,{headers:this.headers});
  }
  addExam(exam: any): Observable<IExam> {
    const transformedExam = this.transformExamForBackend(exam);
    return this.http.post<IExam>(this.baseURL, transformedExam, { headers: this.headers });
  }

  updateExam(exam: any) {
    const transformedExam = this.transformExamForBackend(exam);
    return this.http.put<IExam>(this.baseURL, transformedExam, { headers: this.headers });
  }

  private transformExamForBackend(exam: any): any {
    // Convert duration (number, minutes) to hh:mm:ss string
    const duration = typeof exam.duration === 'number' ? this.minutesToHHMMSS(exam.duration) : exam.duration;
    // Map questions and options to backend structure
    const questions = (exam.questions || []).map((q: any) => ({
      id: q.id ? parseInt(q.id) : 0,
      title: q.title,
      degree: q.degree,
      options: (q.options || []).map((o: any) => ({
        id: o.id ? parseInt(o.id) : 0,
        title: o.title,
        isCorrect: o.isCorrect,
        isChoosedByStudent: o.isChoosedByStudent || false
      }))
    }));
    return {
      id: exam.id ? parseInt(exam.id) : undefined,
      title: exam.title,
      startDate: exam.startDate,
      duration: duration,
      courseId: exam.courseId,
      maxDegree: exam.maxDegree,
      minDegree: exam.minDegree,
      questions: questions
      // Add other properties if needed by backend
    };
  }

  private minutesToHHMMSS(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  }
  deleteExam(examId:any):Observable<IExam> {
    return this.http.delete<IExam>(`${this.baseURL}${examId}`,{headers:this.headers});
  }
}
