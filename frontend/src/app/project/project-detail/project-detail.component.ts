import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectingService } from '../../services/projecting.service';
import { Project } from '../../model/project';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

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

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private projectingService: ProjectingService) { }

  ngOnInit() {
    this.projectId = +this.route.snapshot.params['id'];
    
    // Получаем данные о проекте (через Resolver)
    this.route.data.subscribe((data) => {
      const projectData = data as { prj: Project | null }; 
      if (projectData.prj) {
        this.project = projectData.prj;
        
        // ВАЖНО: Инициализируем картинки только когда проект загружен
        this.setGalleryImages();
      } else {
        this.router.navigate(['/']);
      }
    });

    // Настройки галереи
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

  // Логика заполнения галереи
  setGalleryImages() {
    this.galleryImages = [];

    // ВАРИАНТ 1: Если у проекта есть массив загруженных фото (Multi-upload)
    if (this.project.Photos && this.project.Photos.length > 0) {
      this.project.Photos.forEach(photoUrl => {
        this.galleryImages.push({
          small: photoUrl,
          medium: photoUrl,
          big: photoUrl
        });
      });
    } 
    // ВАРИАНТ 2: Если массива Photos нет, но есть одно главное Image
    else if (this.project.Image) {
      this.galleryImages.push({
        small: this.project.Image,
        medium: this.project.Image,
        big: this.project.Image
      });
    }
    // ВАРИАНТ 3: Если совсем нет фото, показываем заглушку
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