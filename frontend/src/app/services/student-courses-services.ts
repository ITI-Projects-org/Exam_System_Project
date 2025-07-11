import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ICourses } from '../models/ICourses';
@Injectable({
  providedIn: 'root'
})
export class StudentCoursesServices {
  baseUrl : string='https://localhost:7251/api';
  constructor(private http:HttpClient) { }

  getAllCourses():Observable<ICourses[]>{
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<ICourses[]>(`${this.baseUrl}/courses`,{headers});
  }
  editCourse(courseId:any,course:ICourses){
        const token = localStorage.getItem('access_token');
    
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  const dto={
    courseId:courseId,
    courseName:course.name
  }
    return this.http.put(`${this.baseUrl}/Teacher/UpdateCourse`,dto,{headers});
  }
  deleteCourse(productId:any){
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.delete(`${this.baseUrl}/${productId}`,{headers});
  }
}

/*
  Instructions for Using Access Token in Authorized Requests:

  1. Retrieve the access token from localStorage:
     const token = localStorage.getItem('access_token');

  2. Check if the token exists. If not, handle the error:
     if (!token) {
       return throwError(() => new Error('No access token found'));
     }

  3. Create HTTP headers with the Authorization field:
     const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     });

  4. Use these headers in your HTTP requests to ensure the request is authorized.
*/