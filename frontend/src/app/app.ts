import { Component } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Home } from './pages/home/home';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Footer, Home, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
}
