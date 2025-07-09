import { Routes } from '@angular/router';
import { Exams } from './pages/Exams/exams';
import { ExamDetails } from './components/exam-details/exam-details';
import { TakeExam } from './components/take-exam/take-exam';
import { AssignStudentToExam } from './components/assign-student-to-exam/assign-student-to-exam';
import { EditExam } from './components/edit-exam/edit-exam';

export const routes: Routes = [
    {path:'exams', component: Exams}, // Student, Teacher
    {path:'exams/:id/AssignStudentsToExam', component: AssignStudentToExam, data: { renderMode: 'dynamic' }}, // Teacher
    {path:'exams/:id', component: ExamDetails, data: { renderMode: 'dynamic' }},   // form // Student, Teacher
    {path:'exams/:id/take', component: TakeExam, data: { renderMode: 'dynamic' }}, // form // Student
    {path:'exams/:id/edit', component: EditExam, data: { renderMode: 'dynamic' }}, // form // Teacher
    
];
