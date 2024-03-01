import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
public projectId!: number;
  constructor(private route: ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this.projectId = +this.route.snapshot.params['id'];

    this.route.params.subscribe(
      (params) => {
        this.projectId = +params['id'];
      }
    )
  }

  onSelectNext(){
    this.projectId +=1;
    this.router.navigate(['project-detail', this.projectId]);
  }

}
