import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectingService } from '../../services/projecting.service';
import { Project } from '../../model/project';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { AuthService } from '../../services/auth.service'; // <--- Импорт AuthService

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  public projectId!: number;
  project = new Project();
  galleryOptions!: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  
  // Переменная для статуса авторизации
  isUserLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private projectingService: ProjectingService,
    private authService: AuthService // <--- Внедрение сервиса
  ) { }

  ngOnInit() {
    this.projectId = +this.route.snapshot.params['id'];
    
    // 1. Проверяем, залогинен ли пользователь
    this.isUserLoggedIn = this.authService.loggedin();

    this.route.data.subscribe((data) => {
      const projectData = data as { prj: Project | null }; 
      if (projectData.prj) {
        this.project = projectData.prj;
        this.setGalleryImages();
      } else {
        this.router.navigate(['/']);
      }
    });

    this.galleryOptions = [
      {
        width: '100%',
        height: '465px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ];
  }

  setGalleryImages() {
    this.galleryImages = [];

    if (this.project.Photos && this.project.Photos.length > 0) {
      this.project.Photos.forEach(photoUrl => {
        this.galleryImages.push({
          small: photoUrl,
          medium: photoUrl,
          big: photoUrl
        });
      });
    } 
    else if (this.project.Image) {
      this.galleryImages.push({
        small: this.project.Image,
        medium: this.project.Image,
        big: this.project.Image
      });
    }
    else {
      this.galleryImages = [
        {
          small: 'assets/images/project-default1.png',
          medium: 'assets/images/project-default1.png',
          big: 'assets/images/project-default1.png'
        }
      ];
    }
  }
}