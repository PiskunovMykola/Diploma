import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../model/user';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  user: User | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const users = this.userService.getUsers();
    this.user = users.length ? users[0] : null; // Получаем первого пользователя из списка

    if (this.user) {
      this.passwordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmNewPassword: ['', Validators.required]
      }, { validator: this.passwordMatchingValidator });
    }
  }

  // Проверка, что новый пароль и подтвержденный пароль совпадают
  passwordMatchingValidator(fc: FormGroup) {
    return fc.get('newPassword')?.value === fc.get('confirmNewPassword')?.value ? null : { notmatched: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid && this.user) {
      const { currentPassword, newPassword } = this.passwordForm.value;

      if (currentPassword === this.user.password) {
        const updatedUser: User = {
          ...this.user,
          password: newPassword, // Обновляем только пароль
        };

        // Обновляем данные пользователя
        this.userService.updateUser(updatedUser);
        this.toastr.success('Password changed successfully!');
      } else {
        this.toastr.error('Current password is incorrect!');
      }
    } else {
      this.toastr.error('Please fill in all fields correctly.');
    }
  }
}
