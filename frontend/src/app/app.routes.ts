import { Routes } from '@angular/router';
import { Exams } from './pages/Exams/exams';
import { ExamDetails } from './components/exam-details/exam-details';
import { TakeExam } from './components/take-exam/take-exam';
import { AssignStudentToExam } from './components/assign-student-to-exam/assign-student-to-exam';
import { EditExam } from './components/edit-exam/edit-exam';

export const routes: Routes = [
    {path:'exams', component: Exams}, // Student, Teacher
    {path:'exams/:id/AssignStudentsToExam', component: AssignStudentToExam}, // Teacher
    {path:'exams/:id', component: ExamDetails},   // form // Student, Teacher
    {path:'exams/:id/take', component: TakeExam}, // form // Student
    {path:'exams/:id/edit', component: EditExam}, // form // Teacher
    
];
