import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectingService } from '../../services/projecting.service';
import { Project } from '../../model/project';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
public projectId!: number;
project = new Project();
galleryOptions!: NgxGalleryOptions[];
galleryImages!: NgxGalleryImage[];
  constructor(private route: ActivatedRoute, 
              private router: Router,
              private projectingService: ProjectingService) { }

  ngOnInit() {
  this.projectId = +this.route.snapshot.params['id'];
  this.route.data.subscribe((data) => {
    const projectData = data as { prj: Project | null }; 
    if (projectData.prj) {
      this.project = projectData.prj;
    } else {
      this.router.navigate(['/']);
    }
  });


    /*this.route.params.subscribe(
      (params) => {
        this.projectId = +params['id'];
        this.projectingService.getProject(this.projectId).subscribe(
          (data: Project) => {
            this.project = data
          }, error => this.router.navigate(['/'])        
        )
      }
    );*/

    this.galleryOptions = [
      {
        width: '600px',
        height: '465px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ];

    this.galleryImages = [
      {
        small: 'assets/images/proj-1.jpg',
        medium: 'assets/images/proj-1.jpg',
        big: 'assets/images/proj-1.jpg'
      },
      {
        small: 'assets/images/proj-2.jpg',
        medium: 'assets/images/proj-2.jpg',
        big: 'assets/images/proj-2.jpg'
      },
      {
        small: 'assets/images/proj-3.jpg',
        medium: 'assets/images/proj-3.jpg',
        big: 'assets/images/proj-3.jpg'
      },
      {
        small: 'assets/images/proj-4.jpg',
        medium: 'assets/images/proj-4.jpg',
        big: 'assets/images/proj-4.jpg'
      },
      {
        small: 'assets/images/proj-5.jpg',
        medium: 'assets/images/proj-5.jpg',
        big: 'assets/images/proj-5.jpg'
      }
    ];
  }
}

