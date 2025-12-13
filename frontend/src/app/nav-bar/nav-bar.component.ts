import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  loggedinUser!: string;
  constructor(private toastr: ToastrService) {}

  ngOnInit(){

  }

  loggedin() {
    if (typeof window !== 'undefined') {
      // 1. Сначала проверяем, залогинены ли мы (есть ли токен)
      const token = localStorage.getItem('token');
      
      // 2. Достаем имя пользователя для отображения
      this.loggedinUser = localStorage.getItem('userName') || 'User';
      
      // Возвращаем true, если токен есть
      return !!token;
    }
    return false;
  }

  onLogout(){
    // Очищаем всё: и токен, и имя
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.toastr.success("You are logged out!")
  }
}