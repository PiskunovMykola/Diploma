import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Используем AuthService
import { User } from '../../../model/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // Добавили роутер

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
    private authService: AuthService, // Изменили сервис
    private toastr: ToastrService,
    private router: Router // Внедрили роутер для переадресации
  ) { }

  ngOnInit() {
    this.createRegistrationForm();
  }

  createRegistrationForm(){
    this.registrationForm = this.fb.group({
      userName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]], // Firebase требует минимум 6 символов (у вас было 8, можно оставить 8)
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
      
      // === ВЫЗОВ FIREBASE ===
      this.authService.register(this.userData())
        .then(() => {
           // УСПЕХ
           this.toastr.success('Congratulations, you have successfully registered!');
           this.userSubmitted = false;
           this.registrationForm.reset();
           
           // После регистрации сразу логиним и переходим на главную
           // Или можно перекинуть на страницу входа: this.router.navigate(['/user/login']);
           this.router.navigate(['/']); 
        })
        .catch((error) => {
           // ОШИБКА (например, email уже занят)
           console.error(error);
           this.toastr.error('Registration failed: ' + error.message);
        });

    } else {
      this.toastr.error('Kindly fill in the required fields!');
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