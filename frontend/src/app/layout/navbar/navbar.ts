import { ExamDetails } from './../../components/exam-details/exam-details';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from '../../pages/home/home';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  routes: Routes = [
    {path:'',component:Home},
  ];
}
