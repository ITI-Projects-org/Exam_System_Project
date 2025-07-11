import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
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
  createdAt?: string;
  updatedAt?: string;
  isAssigned?: boolean;
}

export interface AssignStudentsRequest {
  examId: number;
  studentIds: string[];
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExamServices {
  baseURL: string = 'https://localhost:7251/api/Exam';
  
  constructor(private http: HttpClient) {
    console.log('ExamServices initialized');
  }

  private get headers(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
  }

  getToken(): string  {
    return localStorage.getItem('token')??'';
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please check your token.';
      } else if (error.status === 0) {
        errorMessage =
          'Cannot connect to server. Please check if the backend is running.';
      }
    }

    console.error('Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getExams(): Observable<IExamListItem[]> {
    return this.http
      .get<IExamListItem[]>(this.baseURL, { headers: this.headers })
      .pipe(
        tap((data) => console.log('Exams API response:', data)),
        catchError(this.handleError)
      );
  }

  getExamById(examId: number | string): Observable<IExam> {
    return this.http
      .get<IExam>(`${this.baseURL}/${examId}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  addExam(exam: IExam): Observable<IExam> {
    console.log('ExamServices.addExam() called with:', exam);

    const examData = { ...exam };
    delete examData.id; // Remove ID for new exams

    console.log('Exam data after removing ID:', examData);

    return this.http
      .post<IExam>(this.baseURL, examData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateExam(exam: IExam): Observable<IExam> {
    return this.http
      .put<IExam>(this.baseURL, exam, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteExam(examId: number | string): Observable<any> {
    return this.http
      .delete(`${this.baseURL}/${examId}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getStudentsOfExam(
    examId: number | string
  ): Observable<ExamStudentDegreeDTO[]> {
    return this.http
      .get<ExamStudentDegreeDTO[]>(`${this.baseURL}/${examId}/students`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  getAllStudents(): Observable<Student[]> {
    const studentsUrl = 'https://localhost:7251/api/Students';
    console.log('Getting all students from:', studentsUrl);
    console.log('Request Headers:', this.headers);

    return this.http
      .get<Student[]>(studentsUrl, { headers: this.headers })
      .pipe(
        tap((data) => console.log('Students API response:', data)),
        catchError(this.handleError)
      );
  }
 getRoleFromToken(): string {
    try {
      const token = this.getToken();
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      // Try common claim names for role
      if (decodedPayload.role) {
        return decodedPayload.role;
      } else if (decodedPayload.roles) {
        return Array.isArray(decodedPayload.roles) ? decodedPayload.roles[0] : decodedPayload.roles;
      } else if (decodedPayload.Role) {
        return decodedPayload.Role;
      } else if (decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        return decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      } else {
        // Try to find any property with value 'Student' or 'Teacher'
        for (const key of Object.keys(decodedPayload)) {
          if (decodedPayload[key] === 'Student' || decodedPayload[key] === 'Teacher') {
            return decodedPayload[key];
          }
        }
        return 'Guest';
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return 'Guest';
    }
  }
  assignStudentsToExam(examId: number, studentIds: string[]): Observable<any> {
    const params = studentIds.map((id) => `studs_Id=${id}`).join('&');
    return this.http
      .post(
        `${this.baseURL}/Assign?ExamId=${examId}&${params}`,
        {},
        { headers: this.headers }
      )
      .pipe(catchError(this.handleError));
  }
  takeExam(){
    return this.http.get(`${this.baseURL}/TakeExam`,{headers:this.headers})
  }
  submitExam(examId: string, answers: any): Observable<any> {
    // Adjust API endpoint and payload as needed
    return this.http.post(`${this.baseURL}/${examId}/submit`, answers, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  getExamToSolve(examId: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${examId}/solve`, { headers: this.headers });
  }
}
