import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IProjectBase } from '../../model/iprojectbase';
import { ProjectingService } from '../../services/projecting.service';
import { Project } from '../../model/project';
import { ToastrService } from 'ngx-toastr';

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
  
  uploadedImages: string[] = []; 
  isImageUploading: boolean = false;
  uploadedVideoUrls: string[] = [];
  isVideoUploading: boolean = false;

  projectId: number | null = null;
  editMode: boolean = false;

  projectView: IProjectBase = {
    Id: 0, Sell: 0, Name: '', Type: '', Goal: 0, Funded: 0, Location: '', Technologies: '', 
    Image: '', Description: '', Photos: [], Videos: [], 
    ContactEmail: '', ContactPhone: '', ContactOther: ''
  };

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute, 
    private projectingService: ProjectingService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (typeof localStorage !== 'undefined' && !localStorage.getItem('token')) {
        this.toastr.error('Please login to add a new project!');
        this.router.navigate(['/user/login']);
        return;
    }

    this.CreateAddProjectForm();
    
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.projectId = +idParam;
      this.editMode = true;
      this.loadProjectData(this.projectId!);
    }

    // Подписка на изменения формы для превью
    this.addProjectForm.valueChanges.subscribe(value => {
      this.projectView = { 
        ...this.projectView, 
        ...value.BasicInfo, 
        ...value.PriceTechInfo,
        ...value.ContactInfo 
      };
      // Обновляем Goal и Funded в превью
      this.projectView.Goal = value.PriceTechInfo.Goal;
      this.projectView.Funded = value.PriceTechInfo.Funded;
      
      if (this.uploadedImages.length > 0) {
        this.projectView.Image = this.uploadedImages[0];
      }
    });
  }

  loadProjectData(id: number) {
    this.projectingService.getProject(id).subscribe((data: Project) => {
      if (data) {
        this.project = data;
        this.projectView = data; 

        this.addProjectForm.patchValue({
          BasicInfo: {
            Sell: data.Sell.toString(),
            Name: data.Name,
            Type: data.Type,
            Location: data.Location
          },
          PriceTechInfo: {
            Goal: data.Goal,
            Funded: data.Funded || 0, // <--- Загружаем Funded
            Technologies: data.Technologies
          },
          OtherInfo: {
            Description: data.Description
          },
          ContactInfo: {
            ContactEmail: data.ContactEmail,
            ContactPhone: data.ContactPhone,
            ContactOther: data.ContactOther
          }
        });

        if (data.Photos) this.uploadedImages = data.Photos;
        else if (data.Image) this.uploadedImages = [data.Image];

        if (data.Videos) this.uploadedVideoUrls = data.Videos;
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
        Goal: [null, [Validators.required, Validators.min(1)]],
        Funded: [0, [Validators.required, Validators.min(0)]], // <--- Добавили поле Funded (по умолчанию 0)
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

  onSubmit() {
    this.nextClicked = true;
    if (this.allTabsValid()) {
      this.mapProject(); 
      
      if (this.editMode) {
        this.projectingService.updateProject(this.project).then(() => {
            this.toastr.success('Project updated successfully!');
            this.navigateAfterSave();
          });
      } else {
        this.projectingService.addProject(this.project);
        this.toastr.success('Project created successfully!');
        this.navigateAfterSave();
      }
    } else {
        this.toastr.error('Please fill all required fields');
    }
  }

  navigateAfterSave() {
    if (this.Sell.value === '2') {
      this.router.navigate(['/sell-project']);
    } else {
      this.router.navigate(['/']);
    }
  }

  mapProject(): void {
    this.project.Id = this.editMode ? this.projectId! : this.projectingService.newProjID();
    this.project.Sell = +this.Sell.value;
    this.project.Name = this.Name.value;
    this.project.Type = this.Type.value;
    this.project.Location = this.Location.value;
    
    this.project.Goal = this.Goal.value;
    this.project.Funded = this.Funded.value || 0; // <--- Сохраняем значение из формы

    this.project.Technologies = this.Technologies.value;
    this.project.Description = this.Description.value;
    this.project.Image = this.uploadedImages.length > 0 ? this.uploadedImages[0] : '';
    this.project.Photos = this.uploadedImages;
    this.project.Videos = this.uploadedVideoUrls;
    this.project.ContactEmail = this.ContactEmail.value;
    this.project.ContactPhone = this.ContactPhone.value;
    this.project.ContactOther = this.ContactOther.value;
    
    if (!this.editMode && typeof localStorage !== 'undefined') {
        this.project.By = localStorage.getItem('token') || 'Unknown';
    }
  }

  // --- Helpers ---
  onFileSelected(event: any) { 
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
  onVideoSelected(event: any) { 
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

  get BasicInfo() { return this.addProjectForm.controls['BasicInfo'] as FormGroup; }
  get PriceTechInfo() { return this.addProjectForm.controls['PriceTechInfo'] as FormGroup; }
  get OtherInfo() { return this.addProjectForm.controls['OtherInfo'] as FormGroup; }
  get ContactInfo() { return this.addProjectForm.controls['ContactInfo'] as FormGroup; }
  
  get Sell() { return this.BasicInfo.controls['Sell']; }
  get Name() { return this.BasicInfo.controls['Name'] as FormControl; }
  get Type() { return this.BasicInfo.controls['Type'] as FormControl; }
  get Location() { return this.BasicInfo.controls['Location'] as FormControl; }
  
  get Goal() { return this.PriceTechInfo.controls['Goal'] as FormControl; }
  get Funded() { return this.PriceTechInfo.controls['Funded'] as FormControl; } // <--- Геттер для Funded
  get Technologies() { return this.PriceTechInfo.controls['Technologies'] as FormControl; }
  
  get Description() { return this.OtherInfo.controls['Description'] as FormControl; }
  get ContactEmail() { return this.ContactInfo.controls['ContactEmail'] as FormControl; }
  get ContactPhone() { return this.ContactInfo.controls['ContactPhone'] as FormControl; }
  get ContactOther() { return this.ContactInfo.controls['ContactOther'] as FormControl; }

  onBack() { this.router.navigate(['/']); }

  allTabsValid(): boolean {
    if (this.BasicInfo.invalid) { this.formTabs.tabs[0].active = true; return false; }
    if (this.PriceTechInfo.invalid) { this.formTabs.tabs[1].active = true; return false; }
    if (this.OtherInfo.invalid) { this.formTabs.tabs[2].active = true; return false; }
    if (this.ContactInfo.invalid) { this.formTabs.tabs[4].active = true; return false; }
    return true;
  }
  selectTab(NextTabId: number, IsCurrentTabValid: boolean) { this.nextClicked = true; if (IsCurrentTabValid) { this.formTabs.tabs[NextTabId].active = true; } }
}