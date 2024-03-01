import { ProjectingService } from '../../services/projecting.service';
import { Component, OnInit } from '@angular/core';
import { IProject } from '../IProject.interface';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  Sell = 1;
  projects: Array<IProject> = [];

  constructor(private route: ActivatedRoute, private projectingService: ProjectingService) { }

  ngOnInit(): void {
    if(this.route.snapshot.url.toString()){
      this.Sell = 2;
    }
    this.projectingService.getAllProjects(this.Sell).subscribe(
      data=>{
      this.projects=data;
      console.log(data);
      }, error => {
        console.log('httperror:')
        console.log(error);
      }
    );
  }
}
