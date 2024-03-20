import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  loggedinUser!: string;
  constructor(private toastr: ToastrService) {}

  ngOnInit(){

  }

  loggedin() {
    if (typeof window !== 'undefined') {
      this.loggedinUser = localStorage.getItem('token')!;
      return !!this.loggedinUser;
    }
    return false;
  }

  onLogout(){
    localStorage.removeItem('token');
    this.toastr.success("You are logged out!")
  }
}
