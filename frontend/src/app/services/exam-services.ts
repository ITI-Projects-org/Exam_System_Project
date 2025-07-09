import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IExam, IExamListItem } from '../models/iexam';


export interface ExamStudentDegreeDTO {
  studentId: string;
  studentName: string;
  degree: number;
  isAbsent: boolean;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAssigned?: boolean;
}

export interface AssignStudentsRequest {
  examId: number;
  studentIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamServices {
  baseURL: string = 'http://localhost:5088/api/Exam';
  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDkyYzBmNi0zZGQyLTQ4NDUtYTYwNi1jOWU0NGQ0ZmQ5ZWEiLCJlbWFpbCI6InRlYWNoZXIxQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVGVhY2hlciIsImV4cCI6MTc1MjE1NDI2M30.4XEjrnbJAmOG534fpT8-QQ28_vlvdVaROGwshU0Hqy0';
  headers: HttpHeaders = new HttpHeaders({ Authorization: 'Bearer ' + this.token });

  constructor(private http: HttpClient) {}

  getExams(): Observable<IExamListItem[]> {
    console.log('ExamServices.getExams() called');
    console.log('Token:', this.token);
    console.log('Headers:', this.headers);
    return new Observable(observer => {
      this.http.get<IExamListItem[]>(this.baseURL, { headers: this.headers }).subscribe({
        next: (data) => {
          console.log('Exams API response:', data);
          observer.next(data);
          observer.complete();
        },
        error: (err) => {
          console.error('Exams API error:', err);
          observer.error(err);
        }
      });
    });
  }

  getExamById(examId: number | string): Observable<IExam> {
    return this.http.get<IExam>(`${this.baseURL}/${examId}`, { headers: this.headers });
  }

  addExam(exam: IExam): Observable<IExam> {
    console.log('ExamServices.addExam() called with:', exam);
    console.log('Exam ID:', exam.id);
    console.log('Base URL:', this.baseURL);
    
    // For new exams, don't include the ID in the URL
    const examData = { ...exam };
    delete examData.id; // Remove ID for new exams
    
    console.log('Exam data after removing ID:', examData);
    console.log('Final URL:', this.baseURL);
    
    return this.http.post<IExam>(this.baseURL, examData, { headers: this.headers });
  }

  updateExam(exam: IExam): Observable<IExam> {
    return this.http.put<IExam>(this.baseURL, exam, { headers: this.headers });
  }

  deleteExam(examId: number | string): Observable<any> {
    return this.http.delete(`${this.baseURL}/${examId}`, { headers: this.headers });
  }

  getStudentsOfExam(examId: number | string): Observable<ExamStudentDegreeDTO[]> {
    return this.http.get<ExamStudentDegreeDTO[]>(`${this.baseURL}/${examId}/students`, { headers: this.headers });
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>('http://localhost:5088/api/Students', { headers: this.headers });
  }

  assignStudentsToExam(examId: number, studentIds: string[]): Observable<any> {
    const params = studentIds.map(id => `studs_Id=${id}`).join('&');
    return this.http.post(`${this.baseURL}/Assign?ExamId=${examId}&${params}`, {}, { headers: this.headers });
  }
} 