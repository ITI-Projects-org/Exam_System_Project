import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentCoursesServices {
  baseUrl : string='https://localhost:7251/api/Courses';

  constructor(private http:HttpClient) { }

  getAllCourses(){
    return this.http.get(this.baseUrl);
  }
  editProduct(productId:any,product:any){
    return this.http.put(`${this.baseUrl}/${productId}`,product);
  }
  deleteProduct(productId:any){
    this.http.delete(`${this.baseUrl}/${productId}`);
  }
}
