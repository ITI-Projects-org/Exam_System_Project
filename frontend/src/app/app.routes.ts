import { Routes } from '@angular/router';
import { ExamsComponent } from './pages/Exams/exams';
import { ExamDetails } from './components/exam-details/exam-details';
import { EditExamComponent } from './components/edit-exam/edit-exam';
import { AssignStudentToExamComponent } from './components/assign-student-to-exam/assign-student-to-exam';

export const routes: Routes = [
  { path: 'exams', component: ExamsComponent },
  { path: 'exams/new', component: EditExamComponent },
  { path: 'exams/:id', component: ExamDetails },
  { path: 'exams/:id/edit', component: EditExamComponent },
  { path: 'exams/:id/assign', component: AssignStudentToExamComponent },
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: '**', redirectTo: '/exams' }
];
