import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  // Получить данные пользователя по его UID
  getUser(uid: string): Observable<any> {
    return this.db.object('users/' + uid).valueChanges();
  }

  // Обновить данные пользователя
  updateUser(uid: string, userData: User): Promise<void> {
    // Удаляем undefined поля перед отправкой, чтобы Firebase не ругался
    const cleanData = JSON.parse(JSON.stringify(userData));
    return this.db.object('users/' + uid).update(cleanData);
  }
}