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
  Sell = 1;
  projects: Array<IProjectBase> = [];
  FilterField = 'Technologies'; 
  FilterValue = ''; 
  SortbyParam = '';
  SortDirection = 'asc';

  constructor(private route: ActivatedRoute, private projectingService: ProjectingService) {}

  ngOnInit(): void {
    // Проверка маршрута (оставляем вашу логику: если есть URL, значит режим 2)
    if (this.route.snapshot.url.toString()) {
      this.Sell = 2;
    }

    // Загрузка данных
    // ТЕПЕРЬ ВСЕ ДАННЫЕ ПРИХОДЯТ ИЗ FIREBASE ЧЕРЕЗ СЕРВИС
    this.projectingService.getAllProjects(this.Sell).subscribe(
      data => {
        this.projects = data;
        console.log('Projects loaded from Firebase:', data);
      },
      error => {
        console.log('Http/Firebase error:');
        console.log(error);
      }
    );
  }

  onFilter() {
    this.FilterValue = this.FilterValue.trim(); 
  }

  onFilterClear() {
    this.FilterValue = ''; 
    this.FilterField = 'Technologies'; 
  }

  onSortDirection() {
    this.SortDirection = this.SortDirection === 'asc' ? 'desc' : 'asc';
  }
}