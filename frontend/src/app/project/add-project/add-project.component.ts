import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IProjectBase } from '../../model/iprojectbase';
import { ProjectingService } from '../../services/projecting.service';
import { Project } from '../../model/project';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  @ViewChild('formTabs') formTabs!: TabsetComponent;
  addProjectForm!: FormGroup;
  nextClicked: boolean = false;
  project = new Project();
  projectTypes: Array<string> = ['Web', 'Mobile', 'Game', 'AI', 'Cloud technologies', 
    'Big data', 'Internet of Things', 'Cybersecurity', 'Software', 'Blockchain'];
  
  // === ФОТО: Переменные ===
  uploadedImages: string[] = []; 
  isImageUploading: boolean = false;

  // === ВИДЕО: Переменные ===
  uploadedVideoUrls: string[] = [];
  isVideoUploading: boolean = false;

  projectView: IProjectBase = {
    Id: 0,
    Sell: 0,
    Name: '',
    Type: '',
    Price: 0,
    Location: '',
    Technologies: '',
    Image: '',
    Description: '',
    Photos: [],
    Videos: []
  };

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private projectingService: ProjectingService) { }

  ngOnInit() {
    this.CreateAddProjectForm();
    this.addProjectForm.valueChanges.subscribe(value => {
      // При обновлении формы обновляем текстовые поля превью
      this.projectView = { ...this.projectView, ...value.BasicInfo, ...value.PriceTechInfo };
      
      // Синхронизируем главное фото (всегда первое в массиве)
      if (this.uploadedImages.length > 0) {
        this.projectView.Image = this.uploadedImages[0];
      }
    });
  }

  CreateAddProjectForm() {
    this.addProjectForm = this.fb.group({
      BasicInfo: this.fb.group({
        Sell: ['2', Validators.required],
        Name: [null, [Validators.required, Validators.minLength(4)]],
        Type: [null, Validators.required],
        Location: [null, Validators.required]
      }),
      PriceTechInfo: this.fb.group({
        Price: [null, [Validators.required, Validators.min(0)]],
        Technologies: [null, Validators.required],
      }),
      OtherInfo: this.fb.group({
        Description: [null]
      })
    });
  }

  // ==========================================
  // === ЗАГРУЗКА ФАЙЛОВ ===
  // ==========================================

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      this.isImageUploading = true;
      
      this.projectingService.uploadFile(file).subscribe({
        next: (url) => {
          this.isImageUploading = false;
          
          this.uploadedImages.push(url);

          // Обновляем превью: первое фото всегда главное
          if (this.uploadedImages.length > 0) {
            this.projectView.Image = this.uploadedImages[0]; 
          }
          
          event.target.value = ''; // Сброс инпута
        },
        error: (error) => {
          console.error('Photo upload failed', error);
          this.isImageUploading = false;
          alert('Failed to upload photo.');
        }
      });
    }
  }

  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      this.isVideoUploading = true;
      
      this.projectingService.uploadFile(file).subscribe({
        next: (url) => {
          this.isVideoUploading = false;
          this.uploadedVideoUrls.push(url);
          event.target.value = ''; // Сброс инпута
        },
        error: (error) => {
          console.error('Video upload failed', error);
          this.isVideoUploading = false;
          alert('Failed to upload video.');
        }
      });
    }
  }

  // ==========================================
  // === УПРАВЛЕНИЕ ГАЛЕРЕЕЙ (Удаление/Сортировка) ===
  // ==========================================

  // 1. Удаление фото
  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
    
    // Обновляем главное фото после удаления
    if (this.uploadedImages.length > 0) {
      this.projectView.Image = this.uploadedImages[0];
    } else {
      this.projectView.Image = ''; // Если фоток больше нет
    }
  }

  // 2. Перемещение фото (step: -1 = влево, 1 = вправо)
  moveImage(index: number, step: number) {
    const newIndex = index + step;

    // Проверка границ массива
    if (newIndex >= 0 && newIndex < this.uploadedImages.length) {
      // Меняем местами через деструктуризацию или временную переменную
      const temp = this.uploadedImages[index];
      this.uploadedImages[index] = this.uploadedImages[newIndex];
      this.uploadedImages[newIndex] = temp;

      // Обновляем главное фото (оно всегда под индексом 0)
      this.projectView.Image = this.uploadedImages[0];
    }
  }

  // 3. Удаление видео
  removeVideo(index: number) {
    this.uploadedVideoUrls.splice(index, 1);
  }

  // 4. Перемещение видео
  moveVideo(index: number, step: number) {
    const newIndex = index + step;
    if (newIndex >= 0 && newIndex < this.uploadedVideoUrls.length) {
      const temp = this.uploadedVideoUrls[index];
      this.uploadedVideoUrls[index] = this.uploadedVideoUrls[newIndex];
      this.uploadedVideoUrls[newIndex] = temp;
    }
  }

  // ==========================================

  get BasicInfo() { return this.addProjectForm.controls['BasicInfo'] as FormGroup; }
  get PriceTechInfo() { return this.addProjectForm.controls['PriceTechInfo'] as FormGroup; }
  get OtherInfo() { return this.addProjectForm.controls['OtherInfo'] as FormGroup; }
  
  get Sell() { return this.BasicInfo.controls['Sell']; }
  get Name() { return this.BasicInfo.controls['Name'] as FormControl; }
  get Type() { return this.BasicInfo.controls['Type'] as FormControl; }
  get Location() { return this.BasicInfo.controls['Location'] as FormControl; }
  get Price() { return this.PriceTechInfo.controls['Price'] as FormControl; }
  get Technologies() { return this.PriceTechInfo.controls['Technologies'] as FormControl; }
  get Description() { return this.OtherInfo.controls['Description'] as FormControl; }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.nextClicked = true;
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return;  
    }
    
    this.mapProject(); // Собираем данные

    const storedProjects = localStorage.getItem('newProject');
    let projectsArray = storedProjects ? JSON.parse(storedProjects) : [];
    projectsArray = Array.isArray(projectsArray) ? projectsArray : []; 
    projectsArray.push(this.project);

    localStorage.setItem('newProject', JSON.stringify(projectsArray));
  
    if (this.Sell.value === '2') {
      this.router.navigate(['/sell-project']);
    } else {
      this.router.navigate(['/']);
    }
  
    console.log('Form submitted:', this.project);
  }

  mapProject(): void{
    this.project.Id = this.projectingService.newProjID();
    this.project.Sell = +this.Sell.value;
    this.project.Name = this.Name.value;
    this.project.Type = this.Type.value;
    this.project.Location = this.Location.value;
    this.project.Price = this.Price.value;
    this.project.Technologies = this.Technologies.value;
    this.project.Description = this.Description.value;
    
    // === СОХРАНЕНИЕ ===
    // Главное фото - первое в списке (если есть)
    this.project.Image = this.uploadedImages.length > 0 ? this.uploadedImages[0] : '';
    
    // Сохраняем полные массивы
    this.project.Photos = this.uploadedImages;
    this.project.Videos = this.uploadedVideoUrls;
  }

  allTabsValid(): boolean {
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return false;
    }

    if (this.PriceTechInfo.invalid) {
      this.formTabs.tabs[1].active = true;
      return false;
    }
    if (this.OtherInfo.invalid) {
      this.formTabs.tabs[2].active = true;
      return false;
    }

    return true;
  }
   
  selectTab(NextTabId: number, IsCurrentTabValid: boolean) {
    this.nextClicked = true;
    if (IsCurrentTabValid) {
      this.formTabs.tabs[NextTabId].active = true;
    }
  }
}