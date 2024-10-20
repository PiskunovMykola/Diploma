import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  @ViewChild('Form') addProjectForm!: NgForm;
  @ViewChild('formTabs') formTabs!: TabsetComponent;

  projectTypes: Array<string> = ['Web', 'Mobile', 'Game', 'AI and machine learning', 'Cloud technologies', 
  'Big data', 'Internet of Things', 'Cybersecurity', 'Software', 'Blockchain']

  projectView = {};
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onBack()
  {
    this.router.navigate(['/']);
  }

  onSubmit(){
    console.log('Form submitted');
    console.log(this.addProjectForm);
  }

  selectTab(tabId: number){
    this.formTabs.tabs[tabId].active = true;
  }
}
