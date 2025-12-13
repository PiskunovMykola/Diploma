import { Component, Input, OnInit } from '@angular/core';
import { IProjectBase } from '../../model/iprojectbase';
import { ProjectingService } from '../../services/projecting.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'] // styleUrls (множественное число) надежнее
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: IProjectBase;
  @Input() hideIcons!: boolean;

  isOwnProject: boolean = false;
  isAdmin: boolean = false; // <--- Новая переменная для Админа

  constructor(private projectingService: ProjectingService) { }

  ngOnInit(): void {
    let currentUserToken = null;
    let userRole = null;

    // Проверяем, доступны ли мы в браузере (чтобы не было ошибки SSR)
    if (typeof localStorage !== 'undefined') {
        currentUserToken = localStorage.getItem('token');
        userRole = localStorage.getItem('role'); // <--- Получаем роль
    }

    // Если роль 'admin', ставим флаг
    if (userRole === 'admin') {
      this.isAdmin = true;
    }

    // ЛОГИКА ОТОБРАЖЕНИЯ КНОПОК:
    // Показываем, если:
    // 1. Проект существует
    // 2. Есть токен (мы залогинены)
    // 3. (Это мой проект) ИЛИ (Я админ)
    if (this.project?.By && currentUserToken) {
      if (this.project.By === currentUserToken || this.isAdmin) {
        this.isOwnProject = true;
      }
    }
  }

  onDeleteProject() {
    // Небольшое улучшение текста confirmation
    const message = this.isAdmin 
      ? 'ВЫ АДМИН: Вы уверены, что хотите удалить ЧУЖОЙ проект?' 
      : 'Вы уверены, что хотите удалить этот проект?';

    if(confirm(message)) {
      this.projectingService.deleteProject(this.project.Id);
      // Перезагрузка страницы, чтобы проект исчез визуально
      // (Можно сделать красивее через Output(), но reload тоже работает)
      window.location.reload(); 
    }
  }
}