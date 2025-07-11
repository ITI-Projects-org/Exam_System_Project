import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../models/ilogin';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginError: string[] = [];
  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get getEmail() {
    return this.loginForm.controls['Email'];
  }
  get getPassword() {
    return this.loginForm.controls['Password'];
  }

  submit() {
    if (this.loginForm.invalid) return;
    this.loginError = [];
    const formValue = this.loginForm.value;
    const dto: ILogin = {
      Email: formValue.Email ?? '',
      Password: formValue.Password ?? '',
    };
    this.authService.login(dto).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (err: HttpErrorResponse) => {
        // look for our `{ errors: string[] }` shape
        this.loginError = err.error?.errors ?? ['An unexpected error occurred'];
        console.log(this.loginError);
        this.cdr.detectChanges();
      },
    });
  }
}
