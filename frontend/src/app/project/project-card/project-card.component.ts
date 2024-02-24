import { Component } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  Project: any = {
    "Id":1,
    "Name":"GrowthApp",
    "Type":"Business application",
    "Price":12000
  }
}
