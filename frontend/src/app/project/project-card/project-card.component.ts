import { Component, Input } from '@angular/core';
import { IProject } from '../IProject.interface';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})

export class ProjectCardComponent {
  @Input() project!: IProject;

}
