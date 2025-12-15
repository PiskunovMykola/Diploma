import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    // Тот же паттерн: 8 символов + 1 цифра + 1 спецсимвол
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    this.passwordForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
      confirmPassword: [null, Validators.required]
    }, { 
      validators: this.passwordMatchingValidator 
    });
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    const pass = fc.get('password')?.value;
    const confirmPass = fc.get('confirmPassword')?.value;

    if (!pass || !confirmPass) {
        return null;
    }

    return pass === confirmPass ? null : { notmatched: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;
      const newPassword = this.passwordForm.get('password')?.value;

      this.afAuth.currentUser.then(user => {
        if (user) {
          user.updatePassword(newPassword)
            .then(() => {
              this.toastr.success('Password changed successfully!');
              this.isSubmitting = false;
              this.router.navigate(['/']);
            })
            .catch((error) => {
              this.isSubmitting = false;
              console.error(error);
              
              if (error.code === 'auth/requires-recent-login') {
                  this.toastr.error('Security timeout. Please logout and login again.');
              } else {
                  this.toastr.error(error.message);
              }
            });
        } else {
          this.isSubmitting = false;
          this.toastr.error('User not logged in. Refreshing page...');
          this.router.navigate(['/user/login']);
        }
      });
    } else {
      this.toastr.error('Please fix errors in the form');
    }
  }

  get password() { return this.passwordForm.get('password'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}