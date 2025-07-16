import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { IRegister } from '../../models/iregister';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerError: string[] = [];
  registerForm = new FormGroup(
    {
      FirstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      LastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      UserName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
      ]),
      ConfirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: (control: AbstractControl) => {
        return this.passwordsMatch(control as FormGroup);
      },
    }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get getFirstName() {
    return this.registerForm.controls['FirstName'];
  }
  get getLastName() {
    return this.registerForm.controls['LastName'];
  }
  get getUserName() {
    return this.registerForm.controls['UserName'];
  }
  get getEmail() {
    return this.registerForm.controls['Email'];
  }
  get getPassword() {
    return this.registerForm.controls['Password'];
  }
  get getConfirmPassword() {
    return this.registerForm.controls['ConfirmPassword'];
  }
  submit() {
    if (this.registerForm.invalid) return;
    this.registerError = [];
    const formValue = this.registerForm.value;
    const dto: IRegister = {
      FirstName: formValue.FirstName ?? '',
      LastName: formValue.LastName ?? '',
      UserName: formValue.UserName ?? '',
      Email: formValue.Email ?? '',
      Password: formValue.Password ?? '',
      ConfirmPassword: formValue.ConfirmPassword ?? '',
    };
    this.authService.register(dto).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (err: HttpErrorResponse) => {
        this.registerError = err.error?.errors ?? [
          'An unexpected error occurred',
        ];
        console.log(this.registerError);
        this.cdr.detectChanges();
      },
    });
  }

  private passwordsMatch(group: FormGroup) {
    const pass = group.get('Password')?.value;
    const confirm = group.get('ConfirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }
}
