import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/registeration/register';
import { Home } from './pages/home/home';
import { Courses } from './pages/Courses/courses';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { ExamsComponent } from './pages/Exams/exams';
import { ExamDetails } from './components/exam-details/exam-details';
import { EditExamComponent } from './components/edit-exam/edit-exam';
import { AssignStudentToExamComponent } from './components/assign-student-to-exam/assign-student-to-exam';
import { NotFound } from './pages/not-found/not-found';
import { studentGuard } from './guards/student.guard';
import { TakeExamComponent } from './components/take-exam/take-exam.component';
import { TakeExamSolveComponent } from './components/take-exam/take-exam-solve.component';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'courses', component: Courses, canActivate: [AuthGuard] },
  { path: 'students', component: Student, canActivate: [AuthGuard] },
  { path: 'teacher', component: Teacher, canActivate: [AuthGuard] },
  { path: 'exams', component: ExamsComponent, canActivate: [AuthGuard] },
  { path: 'exams/new', component: EditExamComponent, canActivate: [AuthGuard] },
  { path: 'exams/:id', component: ExamDetails, canActivate: [AuthGuard] },
  {
    path: 'exams/:id/edit',
    component: EditExamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'exams/:id/assign',
    component: AssignStudentToExamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'take-exam/:id',
    component: TakeExamComponent,
    canActivate: [studentGuard, AuthGuard],
  },
  {
    path: 'take-exam/:id/solve',
    component: TakeExamSolveComponent,
    canActivate: [studentGuard, AuthGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFound },
];
