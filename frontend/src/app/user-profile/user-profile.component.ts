import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  selectedImage: any = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Получаем email текущего пользователя из localStorage
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    if (!currentUserEmail) {
      console.log('No email found in localStorage.');
      return; // Если email не найден в localStorage, прекратить выполнение
    }

    // Ищем пользователя по email
    this.user = this.userService.getUserByEmail(currentUserEmail);

    if (!this.user) {
      console.log('User not found for email:', currentUserEmail);
      return; // Если пользователь не найден, выходим
    }

    // Создаем форму с данными пользователя
    this.profileForm = this.fb.group({
      userName: [this.user.userName, Validators.required],
      email: [{ value: this.user.email, disabled: true }],  // Email заблокирован для редактирования
      mobile: [this.user.mobile, [Validators.required, Validators.maxLength(10)]], // Мобильный номер
      bio: [this.user.bio || '', Validators.maxLength(500)],
      profileImage: [this.user.profileImage || ''],
    });

    // Загружаем изображение из localStorage для текущего пользователя
    const savedImage = this.userService.getProfileImage(currentUserEmail);
    if (savedImage) {
      this.selectedImage = savedImage;
    }
  }

  // Метод для обработки изменения биографии и других данных
  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUser: User = {
        ...this.user!,
        userName: this.profileForm.value.userName,
        bio: this.profileForm.value.bio,
        mobile: this.profileForm.value.mobile,  // Мобильный номер
        profileImage: this.selectedImage || this.user!.profileImage, // Если изображение не выбрано, оставляем старое
      };

      // Обновляем пользователя в localStorage
      this.userService.updateUser(updatedUser);
      this.toastr.success('Profile updated successfully!');
    } else {
      this.toastr.error('Please fill in the required fields correctly.');
    }
  }

  // Метод для обработки выбора изображения
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result; // Преобразуем изображение в base64
        // Сохраняем изображение в localStorage
        if (this.user) {
          this.userService.setProfileImage(this.user.email, this.selectedImage);
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
