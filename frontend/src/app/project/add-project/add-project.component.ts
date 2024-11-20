import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IProjectBase } from '../../model/iprojectbase';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  @ViewChild('formTabs') formTabs!: TabsetComponent;
  addProjectForm!: FormGroup;
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
    private router: Router) { }

  ngOnInit() {
    this.CreateAddProjectForm();
    this.addProjectForm.valueChanges.subscribe(value => {
      this.projectView = { ...this.projectView, ...value.BasicInfo, ...value.PriceTechInfo };
    });
  }

  CreateAddProjectForm() {
    this.addProjectForm = this.fb.group({
      Sell: ['2', Validators.required],
      BasicInfo: this.fb.group({
        Name: [null, [Validators.required, Validators.minLength(4)]],
        Type: [null, Validators.required],
        Location: [null, Validators.required]
      }),
      PriceTechInfo: this.fb.group({
        Price: [null, [Validators.required, Validators.min(0)]],
        Technologies: [null, Validators.required],
      })
    });
  }

  get BasicInfo() {
    return this.addProjectForm.controls['BasicInfo'] as FormGroup;
  }

  get PriceTechInfo() {
    return this.addProjectForm.controls['PriceTechInfo'] as FormGroup;
  }

  get Sell() {
    return this.addProjectForm.controls['Sell'];
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return;  
    }
  
    const newProject = {
      Sell: this.Sell.value,
      ...this.BasicInfo.value,
      ...this.PriceTechInfo.value
    };
  
    if (typeof window !== 'undefined') {
      localStorage.setItem('newProject', JSON.stringify(newProject));
    }
  
    if (this.Sell.value === '2') {
      this.router.navigate(['/sell-project']);
    } else {
      this.router.navigate(['/']);
    }
  
    console.log('Form submitted:', newProject);
  }
  

  selectTab(tabId: number) {
    this.formTabs.tabs[tabId].active = true;
  }
}
