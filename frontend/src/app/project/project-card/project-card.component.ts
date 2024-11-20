import { Component, Input } from '@angular/core';
import { IProjectBase } from '../../model/iprojectbase';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})

export class ProjectCardComponent {
  @Input() project!: IProjectBase;
  @Input() hideIcons!: boolean;

}
