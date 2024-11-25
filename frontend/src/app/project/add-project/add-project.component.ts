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
  
  projectView: IProjectBase = {
    Id: 0,
    Sell: 0,
    Name: '',
    Type: '',
    Price: 0,
    Location: '',
    Technologies: '',
    Image: ''
  };

  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private projectingService: ProjectingService) { }

  ngOnInit() {
    this.CreateAddProjectForm();
    this.addProjectForm.valueChanges.subscribe(value => {
      this.projectView = { ...this.projectView, ...value.BasicInfo, ...value.PriceTechInfo };
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

  get BasicInfo() {
    return this.addProjectForm.controls['BasicInfo'] as FormGroup;
  }

  get PriceTechInfo() {
    return this.addProjectForm.controls['PriceTechInfo'] as FormGroup;
  }

  get OtherInfo() {
    return this.addProjectForm.controls['OtherInfo'] as FormGroup;
  }

  
  get Sell() {
    return this.BasicInfo.controls['Sell'];
  }

  get Name() {
    return this.BasicInfo.controls['Name'] as FormControl;
  }

  
  get Type() {
    return this.BasicInfo.controls['Type'] as FormControl;
  }

  get Location() {
    return this.BasicInfo.controls['Location'] as FormControl;
  }

  get Price() {
    return this.PriceTechInfo.controls['Price'] as FormControl;
  }

  get Technologies() {
    return this.PriceTechInfo.controls['Technologies'] as FormControl;
  }

  get Description() {
    return this.OtherInfo.controls['Description'] as FormControl;
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.nextClicked = true;
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return;  
    }
    this.mapProject();

    const storedProjects = localStorage.getItem('newProject');
    let projectsArray = storedProjects ? JSON.parse(storedProjects) : [];
    projectsArray = Array.isArray(projectsArray) ? projectsArray : []; // Проверка на массив
    projectsArray.push(this.project);

    localStorage.setItem('newProject', JSON.stringify(projectsArray));
    //console.log('Submitting project:', this.project); 
    //this.projectingService.addProject(this.project);
  
    /*const newProject = {
      Sell: this.Sell.value,
      ...this.BasicInfo.value,
      ...this.PriceTechInfo.value,
      ...this.OtherInfo.value
    };
  
    if (typeof window !== 'undefined') {
      localStorage.setItem('newProject', JSON.stringify(newProject));
    }*/
  
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