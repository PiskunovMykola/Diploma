import { Component, Input, OnInit } from '@angular/core';
import { IProjectBase } from '../../model/iprojectbase';
// Убедитесь, что путь к сервису правильный:
import { ProjectingService } from '../../services/projecting.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: IProjectBase;
  @Input() hideIcons!: boolean;

  isOwnProject: boolean = false;

  // Внедряем сервис в конструктор (добавили private projectingService...)
  constructor(private projectingService: ProjectingService) { }

  ngOnInit(): void {
    const currentUserEmail = localStorage.getItem('token'); 

    if (this.project.By && currentUserEmail && this.project.By === currentUserEmail) {
      this.isOwnProject = true;
    }
  }

  // Новый метод для клика по кнопке
  onDeleteProject() {
    // 1. Спрашиваем подтверждение
    if(confirm('Вы уверены, что хотите удалить этот проект?')) {
      
      // 2. Вызываем сервис для удаления из localStorage
      // (Обратите внимание: проекты из JSON файла удалить нельзя, только свои из LS)
      this.projectingService.deleteProject(this.project.Id);
      
      // 3. Перезагружаем страницу для обновления списка
      window.location.reload();
    }
  }
}