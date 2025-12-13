import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private toastr: ToastrService, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogin(loginForm: NgForm){
    console.log(loginForm.value);
    
    // Вызываем метод login из сервиса. Теперь это асинхронная операция (Promise)
    this.authService.login(loginForm.value)
      .then(() => {
        // УСПЕХ
        this.toastr.success('Successful Login!');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        // ОШИБКА
        console.error(error); // Для отладки в консоли
        // Firebase возвращает понятные ошибки, можно вывести error.message
        this.toastr.error('Login Failed: ' + error.message);
      });
  }
}