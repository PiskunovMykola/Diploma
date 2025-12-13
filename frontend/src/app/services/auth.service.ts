import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // <--- 1. Добавили импорт БД

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase // <--- 2. Внедрили БД в конструктор
  ) { }

  // === 1. ВХОД (LOGIN) С ПРОВЕРКОЙ РОЛИ ===
  login(user: any) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        if (result.user) {
          localStorage.setItem('token', result.user.uid);
          
          // Достаем имя
          const name = result.user.displayName || user.email; 
          localStorage.setItem('userName', name);

          // === 3. ПРОВЕРЯЕМ, АДМИН ЛИ ЭТО ===
          // Идем в базу данных в папку users -> [UID пользователя]
          this.db.object('users/' + result.user.uid).valueChanges().subscribe((userData: any) => {
             // Если запись существует и роль равна 'admin'
             if (userData && userData.role === 'admin') {
               console.log('👑 Admin logged in!');
               localStorage.setItem('role', 'admin'); // Сохраняем права
             } else {
               localStorage.removeItem('role'); // У обычных юзеров удаляем, если вдруг было
             }
          });
        }
      });
  }

  // === 2. РЕГИСТРАЦИЯ (REGISTER) ===
  register(user: any) {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        if (result.user) {
          result.user.updateProfile({
            displayName: user.userName 
          });
          
          localStorage.setItem('userName', user.userName);
          localStorage.setItem('token', result.user.uid);
          // При регистрации роль по умолчанию пустая (или 'user'), поэтому ничего не пишем в 'role'
        }
      });
  }

  // === 3. ВЫХОД (LOGOUT) ===
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role'); // <--- 4. Обязательно удаляем права админа при выходе
    this.afAuth.signOut(); 
    this.router.navigate(['/user/login']);
  }

  // === 4. ПРОВЕРКА СТАТУСА ===
  loggedin(): boolean {
    return !!localStorage.getItem('token');
  }

  // === 5. ПОЛУЧИТЬ ID ===
  getUserId(): string | null {
    return localStorage.getItem('token');
  }
}