import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { exhaustMap, pipe } from 'rxjs';
import {CommonModule} from '@angular/common'

@Component({
  selector: 'app-edit-exam',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-exam.html',
  styleUrl: './edit-exam.css'
})
export class EditExam {
  examForm = new FormGroup({
    Id: new FormControl(),
    Title:new FormControl('',[Validators.required,Validators.minLength(3)]),
    MaxDegree:new FormControl([Validators.required,Validators.min(1)]),
    MinDegree:new FormControl([Validators.min(0)]),
    StartDate: new FormControl([Validators.required]),
    Duration: new FormControl([Validators.required]),
    CourseId : new FormControl([Validators.required]),
    TeacherId: new FormControl()

  })
  AddNewExam(){
    // console.log(this.examForm.value)
    if(this.examForm.status == 'VALID'){
      console.log("valid✅")
      console.log(this.examForm.value)
    }
    else {
      console.log("solve error.")
    }
  }
  get getTitle(){
    return this.examForm.controls['Title'];
  }
    get getMaxDegree(){
    return this.examForm.controls['MaxDegree'];
  }
    get getMinDegree(){
    return this.examForm.controls['MinDegree'];
  }
  get getStartDate(){
    return this.examForm.controls['StartDate'];
  }
  get getDuration(){
    return this.examForm.controls['Duration'];
  }
  get getCourseId(){
    return this.examForm.controls['CourseId'];
  }
}
