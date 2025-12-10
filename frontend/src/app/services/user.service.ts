import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // Добавление нового пользователя
  addUser(user: User) {
    let users = [];
    if (localStorage.getItem('Users')) {
      users = JSON.parse(localStorage.getItem('Users') as string);
      users = [user, ...users];
    } else {
      users = [user];
    }
    localStorage.setItem('Users', JSON.stringify(users));

    // Сохраняем текущего пользователя (email)
    localStorage.setItem('currentUserEmail', user.email);
  }

  // Получение всех пользователей
  getUsers(): User[] {
    const users = localStorage.getItem('Users');
    return users ? JSON.parse(users) : [];
  }

  // Обновление данных пользователя
  updateUser(updatedUser: User): void {
    let users = this.getUsers();
    users = users.map(user => user.email === updatedUser.email ? updatedUser : user);  // Обновляем пользователя по email
    localStorage.setItem('Users', JSON.stringify(users));

    // Обновляем текущего пользователя в localStorage
    if (localStorage.getItem('currentUserEmail') === updatedUser.email) {
      localStorage.setItem('currentUserEmail', updatedUser.email);
    }
  }

  // Получение пользователя по email
  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  // Сохранение изображения профиля для конкретного пользователя
  setProfileImage(email: string, image: string): void {
    localStorage.setItem(`profileImage-${email}`, image);
  }

  // Получение изображения профиля для конкретного пользователя
  getProfileImage(email: string): string | null {
    return localStorage.getItem(`profileImage-${email}`);
  }
}
