import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProjectBase } from '../../model/iprojectbase';
import { ProjectingService } from '../../services/projecting.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Array<IProjectBase> = [];
  
  // Переменные для фильтрации и сортировки (ваши старые)
  FilterField = 'Technologies'; 
  FilterValue = ''; 
  SortbyParam = '';
  SortDirection = 'asc';
  
  // Флаг: мы в разделе "Мои проекты" (Sell) или "Магазин" (Buy)?
  isMyProjectsPage = false; 

  constructor(
    private route: ActivatedRoute, 
    private projectingService: ProjectingService
  ) {}

  ngOnInit(): void {
    // 1. Определяем, на какой мы странице
    // Если в URL есть что-то (например 'sell-project'), считаем это страницей "Мои проекты"
    if (this.route.snapshot.url.toString()) {
      this.isMyProjectsPage = true;
    }

    // 2. Получаем ID текущего пользователя
    // (Используем безопасную проверку для SSR)
    let currentUserId = '';
    if (typeof localStorage !== 'undefined') {
      currentUserId = localStorage.getItem('token') || '';
    }

    // 3. Загружаем ВСЕ проекты и фильтруем здесь
    this.projectingService.getAllProjects().subscribe(
      data => {
        if (this.isMyProjectsPage) {
          // === ЛОГИКА ДЛЯ РАЗДЕЛА SELL (МОИ ПРОЕКТЫ) ===
          // Показываем только те, которые создал Я
          this.projects = data.filter(p => p.By === currentUserId);
        } else {
          // === ЛОГИКА ДЛЯ РАЗДЕЛА BUY (ЧУЖИЕ ПРОЕКТЫ) ===
          // Показываем проекты, созданные ДРУГИМИ людьми
          // (Если я не залогинен, currentUserId пустой, значит увижу всё)
          this.projects = data.filter(p => p.By !== currentUserId);
        }
        
        console.log('Projects loaded:', this.projects);
      },
      error => {
        console.log('Http error:', error);
      }
    );
  }

  // Ваши методы фильтрации (оставляем без изменений)
  onFilter() { this.FilterValue = this.FilterValue.trim(); }
  onFilterClear() { this.FilterValue = ''; this.FilterField = 'Technologies'; }
  onSortDirection() { this.SortDirection = this.SortDirection === 'asc' ? 'desc' : 'asc'; }
}