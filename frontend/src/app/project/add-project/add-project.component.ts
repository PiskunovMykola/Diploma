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
  
  // ФОТО и ВИДЕО переменные
  uploadedImages: string[] = []; 
  isImageUploading: boolean = false;
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
    Videos: [],
    ContactEmail: '',
    ContactPhone: '',
    ContactOther: ''
  };

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private projectingService: ProjectingService) { }

  ngOnInit() {
    this.CreateAddProjectForm();
    this.addProjectForm.valueChanges.subscribe(value => {
      this.projectView = { 
        ...this.projectView, 
        ...value.BasicInfo, 
        ...value.PriceTechInfo,
        ...value.ContactInfo // Обновляем превью контактов (если нужно)
      };
      
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
      }),
      ContactInfo: this.fb.group({
        ContactEmail: [null, [Validators.required, Validators.email]],
        ContactPhone: [null],
        ContactOther: [null]
      })
    });
  }
  
  onFileSelected(event: any) { /* код из прошлого ответа */ 
      const file: File = event.target.files[0];
      if (file) {
        this.isImageUploading = true;
        this.projectingService.uploadFile(file).subscribe({
          next: (url) => {
            this.isImageUploading = false;
            this.uploadedImages.push(url);
            if (this.uploadedImages.length === 1) this.projectView.Image = url; 
            event.target.value = ''; 
          },
          error: (error) => { console.error(error); this.isImageUploading = false; }
        });
      }
  }

  onVideoSelected(event: any) { /* код из прошлого ответа */ 
      const file: File = event.target.files[0];
      if (file) {
        this.isVideoUploading = true;
        this.projectingService.uploadFile(file).subscribe({
          next: (url) => {
            this.isVideoUploading = false;
            this.uploadedVideoUrls.push(url);
            event.target.value = '';
          },
          error: (error) => { console.error(error); this.isVideoUploading = false; }
        });
      }
  }

  removeImage(index: number) { this.uploadedImages.splice(index, 1); if (this.uploadedImages.length > 0) this.projectView.Image = this.uploadedImages[0]; else this.projectView.Image = ''; }
  moveImage(index: number, step: number) { const newIndex = index + step; if (newIndex >= 0 && newIndex < this.uploadedImages.length) { const temp = this.uploadedImages[index]; this.uploadedImages[index] = this.uploadedImages[newIndex]; this.uploadedImages[newIndex] = temp; this.projectView.Image = this.uploadedImages[0]; } }
  removeVideo(index: number) { this.uploadedVideoUrls.splice(index, 1); }
  moveVideo(index: number, step: number) { const newIndex = index + step; if (newIndex >= 0 && newIndex < this.uploadedVideoUrls.length) { const temp = this.uploadedVideoUrls[index]; this.uploadedVideoUrls[index] = this.uploadedVideoUrls[newIndex]; this.uploadedVideoUrls[newIndex] = temp; } }


  // Геттеры для форм
  get BasicInfo() { return this.addProjectForm.controls['BasicInfo'] as FormGroup; }
  get PriceTechInfo() { return this.addProjectForm.controls['PriceTechInfo'] as FormGroup; }
  get OtherInfo() { return this.addProjectForm.controls['OtherInfo'] as FormGroup; }
  // НОВЫЙ ГЕТТЕР
  get ContactInfo() { return this.addProjectForm.controls['ContactInfo'] as FormGroup; }
  
  get Sell() { return this.BasicInfo.controls['Sell']; }
  get Name() { return this.BasicInfo.controls['Name'] as FormControl; }
  get Type() { return this.BasicInfo.controls['Type'] as FormControl; }
  get Location() { return this.BasicInfo.controls['Location'] as FormControl; }
  get Price() { return this.PriceTechInfo.controls['Price'] as FormControl; }
  get Technologies() { return this.PriceTechInfo.controls['Technologies'] as FormControl; }
  get Description() { return this.OtherInfo.controls['Description'] as FormControl; }
  
  // Геттеры для полей контактов
  get ContactEmail() { return this.ContactInfo.controls['ContactEmail'] as FormControl; }
  get ContactPhone() { return this.ContactInfo.controls['ContactPhone'] as FormControl; }
  get ContactOther() { return this.ContactInfo.controls['ContactOther'] as FormControl; }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.nextClicked = true;
    if (this.allTabsValid()) {
      this.mapProject();
      
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
    } else {
        alert('Please fill all required fields');
    }
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
    
    this.project.Image = this.uploadedImages.length > 0 ? this.uploadedImages[0] : '';
    this.project.Photos = this.uploadedImages;
    this.project.Videos = this.uploadedVideoUrls;

    // === СОХРАНЕНИЕ КОНТАКТОВ ===
    this.project.ContactEmail = this.ContactEmail.value;
    this.project.ContactPhone = this.ContactPhone.value;
    this.project.ContactOther = this.ContactOther.value;
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
    // Проверка контактов
    if (this.ContactInfo.invalid) {
        this.formTabs.tabs[4].active = true; // Индекс вкладки Contact
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