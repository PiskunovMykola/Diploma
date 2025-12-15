import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  user!: User;
  userSubmitted!: boolean;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createRegistrationForm();
  }

  createRegistrationForm(){
    // Регулярное выражение: 
    // (?=.*[0-9]) - хотя бы одна цифра
    // (?=.*[!@#$%^&*]) - хотя бы один спецсимвол
    // .{8,} - длина минимум 8
    // Примечание: если нужно проверять конкретные спецсимволы, можно изменить часть [!@#$%^&*]
    // Здесь мы используем более общий паттерн для спецсимволов: [^a-zA-Z0-9] (любой символ, не являющийся буквой или цифрой)
    // Либо конкретный список: [!@#$%^&*(),.?":{}|<>]
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    this.registrationForm = this.fb.group({
      userName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      // Обновленная валидация пароля
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
      confirmPassword: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.maxLength(10)]],
    }, {validator: this.passwordMatchingValidator});
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get('password')?.value === fc.get('confirmPassword')?.value ? null :
      { notmatched: true };
  }

  onSubmit(){
    console.log(this.registrationForm.value);
    this.userSubmitted = true;

    if(this.registrationForm.valid){
      
      this.authService.register(this.userData())
        .then(() => {
           this.toastr.success('Congratulations, you have successfully registered!');
           this.userSubmitted = false;
           this.registrationForm.reset();
           this.router.navigate(['/']); 
        })
        .catch((error) => {
           console.error(error);
           this.toastr.error('Registration failed: ' + error.message);
        });

    } else {
      this.toastr.error('Kindly fill in the required fields correctly!');
    }
  }

  userData(): User {
    return this.user = {
      userName: this.userName.value,
      email: this.email.value,
      password: this.password.value,
      mobile: this.mobile.value
    }
  }

  // Геттеры
  get userName(){
    return this.registrationForm.get('userName') as FormControl;
  }

  get email(){
    return this.registrationForm.get('email') as FormControl;
  }

  get password(){
    return this.registrationForm.get('password') as FormControl;
  }

  get confirmPassword(){
    return this.registrationForm.get('confirmPassword') as FormControl;
  }

  get mobile(){
    return this.registrationForm.get('mobile') as FormControl;
  }
}