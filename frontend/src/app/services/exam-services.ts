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
  private tokenSubject = new BehaviorSubject<string>('');
  public token$ = this.tokenSubject.asObservable();

  // Test credentials from database seeder
  private readonly testEmail = 'teacher1@example.com';
  private readonly testPassword = 'Teacher123!';

  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {
    console.log('ExamServices initialized');
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      await this.getFreshToken();
    } catch (error) {
      console.error('Failed to initialize token:', error);
    }
  }

  private getFreshToken(): Promise<void> {
    const loginData = {
      email: this.testEmail,
      password: this.testPassword,
    };

    return this.http
      .post<LoginResponse>(
        'https://localhost:7251/api/Account/login',
        loginData
      )
      .toPromise()
      .then((response) => {
        if (response && response.token) {
          this.tokenSubject.next(response.token);
          this._headers = new HttpHeaders({
            Authorization: 'Bearer ' + response.token,
            'Content-Type': 'application/json',
          });
          console.log('Token refreshed successfully');
        }
      })
      .catch((error) => {
        console.error('Failed to get fresh token:', error);
        throw error;
      });
  }

  private get headers(): HttpHeaders {
    return this._headers;
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
        // Try to refresh token on 401
        this.getFreshToken().catch((e) =>
          console.error('Token refresh failed:', e)
        );
      } else if (error.status === 0) {
        errorMessage =
          'Cannot connect to server. Please check if the backend is running.';
      }
    }

    console.error('Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getExams(): Observable<IExamListItem[]> {
    console.log('ExamServices.getExams() called');
    console.log('Request URL:', this.baseURL);
    console.log('Request Headers:', this.headers);

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

    // For new exams, don't include the ID in the URL
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
}
