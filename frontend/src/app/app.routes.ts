import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';
import { ExamsComponent } from './pages/Exams/exams';
import { ExamDetails } from './components/exam-details/exam-details';
import { EditExamComponent } from './components/edit-exam/edit-exam';
import { AssignStudentToExamComponent } from './components/assign-student-to-exam/assign-student-to-exam';
import { studentGuard } from './guards/student.guard';
import { TakeExamComponent } from './components/take-exam/take-exam.component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'exams', component: ExamsComponent },
  { path: 'exams/new', component: EditExamComponent },
  { path: 'exams/:id', component: ExamDetails },
  { path: 'exams/:id/edit', component: EditExamComponent },
  { path: 'exams/:id/assign', component: AssignStudentToExamComponent },
  { path: 'take-exam/:id', component: TakeExamComponent, canActivate: [studentGuard] },
  {
    path: 'take-exam/:id/solve',
    loadComponent: () =>
      import('./components/take-exam/take-exam-solve.component').then((m) => m.TakeExamSolveComponent),
    canActivate: [studentGuard],
  },
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: '**', redirectTo: '/exams' },
];
