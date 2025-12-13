import { Component, Input, OnInit } from '@angular/core';
import { IProjectBase } from '../../model/iprojectbase';
import { ProjectingService } from '../../services/projecting.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css' // Обратите внимание: styleUrl или styleUrls (зависит от версии Angular)
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: IProjectBase;
  @Input() hideIcons!: boolean;

  isOwnProject: boolean = false;

  constructor(private projectingService: ProjectingService) { }

  ngOnInit(): void {
    let currentUserEmail = null;

    // === ИСПРАВЛЕНИЕ ОШИБКИ ===
    // Проверяем, существует ли localStorage (мы в браузере?)
    if (typeof localStorage !== 'undefined') {
        currentUserEmail = localStorage.getItem('token');
    }
    // ==========================

    // Проверка на null добавлена в условие
    if (this.project?.By && currentUserEmail && this.project.By === currentUserEmail) {
      this.isOwnProject = true;
    }
  }

  onDeleteProject() {
    if(confirm('Вы уверены, что хотите удалить этот проект?')) {
      this.projectingService.deleteProject(this.project.Id);
      window.location.reload();
    }
  }
}