import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectingService } from '../../services/projecting.service';
import { Project } from '../../model/project';
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
public projectId!: number;
project = new Project();
  constructor(private route: ActivatedRoute, 
              private router: Router,
              private projectingService: ProjectingService) { }

  ngOnInit() {
    this.projectId = +this.route.snapshot.params['id'];

    this.route.params.subscribe(
      (params) => {
        this.projectId = +params['id'];
        this.projectingService.getProject(this.projectId).subscribe(
          (data: Project) => {
            this.project = data
          }        
        )
      }
    )
  }
}
