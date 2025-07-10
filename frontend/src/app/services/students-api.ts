import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsApi {
  baseUrl = 'https://localhost:7251/api/students';
  constructor(private http: HttpClient) {}

  getStudents(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
