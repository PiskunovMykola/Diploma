import { Component, Input, OnInit } from '@angular/core';
import { IProjectBase } from '../../model/iprojectbase';
import { ProjectingService } from '../../services/projecting.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: IProjectBase;
  @Input() hideIcons!: boolean;

  isOwnProject: boolean = false;
  isAdmin: boolean = false;

  constructor(private projectingService: ProjectingService) { }

  ngOnInit(): void {
    let currentUserToken = null;
    let userRole = null;

    if (typeof localStorage !== 'undefined') {
        currentUserToken = localStorage.getItem('token');
        userRole = localStorage.getItem('role');
    }

    if (userRole === 'admin') {
      this.isAdmin = true;
    }

    if (this.project?.By && currentUserToken) {
      if (this.project.By === currentUserToken || this.isAdmin) {
        this.isOwnProject = true;
      }
    }
  }

  onDeleteProject() {
    const message = this.isAdmin 
      ? 'YOU ARE AN ADMIN: Are you sure you want to delete SOMEONE ELSE PROJECT?' 
      : 'Are you sure you want to delete this project?';

    if(confirm(message)) {
      this.projectingService.deleteProject(this.project.Id);
      window.location.reload(); 
    }
  }
}