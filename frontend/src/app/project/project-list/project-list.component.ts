import { ProjectingService } from '../../services/projecting.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProjectBase } from '../../model/iprojectbase';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  Sell = 1;
  projects: Array<IProjectBase> = [];

  constructor(private route: ActivatedRoute, private projectingService: ProjectingService) { }

  ngOnInit(): void {
    if (this.route.snapshot.url.toString()) {
      this.Sell = 2;
    }
    this.projectingService.getAllProjects(this.Sell).subscribe(
      data => {
        this.projects = data;
        const newProjectString = localStorage.getItem('newProject'); 
        if (newProjectString) { 
          const newProject = JSON.parse(newProjectString);
          if (newProject.Sell == this.Sell) {
            this.projects = [newProject, ...this.projects];
          }
        }
        console.log(data);
      }, error => {
        console.log('httperror:');
        console.log(error);
      }
    );
  }
  
}
