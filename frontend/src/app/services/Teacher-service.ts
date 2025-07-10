import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { IupdateCourse } from '../models/iupdate-course';
import { IassignStudCrs } from '../models/iassign-stud-crs';
import { Istudent } from '../models/istudent';
import { Iteacher } from '../models/iteacher';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
baseUrl : string = "https://localhost:7251/api/Teacher"
  constructor(private http : HttpClient) {  }

  GetCourses ():Observable<Course[]>{
    return this.http.get<Course[]>(`${this.baseUrl}/GetCourses`)
  }

  AddCourse(courseName: string ):Observable<Course>{
    return this.http.post<Course>(`${this.baseUrl}/AddCourse`,courseName)

  }
  UpdateCourse(IupdateCourse:any):Observable<IupdateCourse>{
    return this.http.put<IupdateCourse>(`${this.baseUrl}/UpdateCourse`,IupdateCourse)
  }

  AssignCourses(IassignStudCrs:any):Observable<IassignStudCrs>{
    return this.http.post<IassignStudCrs>(`${this.baseUrl}/AssignCourses`,IassignStudCrs)
  }
  getCoursesBySearch():Observable<Course[]>{
    return this.http.get<Course[]>(`${this.baseUrl}/GetCoursesBySearch`)
  }
  getStudentsBySearch(name : string):Observable<Istudent[]>{
    return this.http.get<Istudent[]>(`${this.baseUrl}/GetStudentsBySearch/${name}`)
  }
  getStudentsforCourse(courseId:number):Observable<Istudent[]>{
    return this.http.get<Istudent[]>(`${this.baseUrl}/GetStudentsforCourse/${courseId}`)
  }

  getCoursesforStudent():Observable<Course[]>{
    return this.http.get<Course[]>(`${this.baseUrl}/GetCoursesforStudent`)
  }
  GetAllTeachers():Observable<Iteacher[]>{
    return this.http.get<Iteacher[]>(`${this.baseUrl}/GetAllTeachers`)
  }

  AddTeacher(iteacher : Iteacher):Observable<Iteacher>{
    return this.http.post<Iteacher>(`${this.baseUrl}/AddTeacher`,iteacher)
  }
  UpdateTeacher(teacherId:string,iteacher : Iteacher):Observable<Iteacher>{
    return this.http.put<Iteacher>(`${this.baseUrl}/UpdateTeacher/${teacherId}`,iteacher)
  }
}
