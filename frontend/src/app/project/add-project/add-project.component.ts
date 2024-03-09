import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  @ViewChild('Form') addProjectForm: NgForm | undefined;
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

}
