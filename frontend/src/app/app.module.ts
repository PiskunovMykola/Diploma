import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectingService } from './services/projecting.service';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { LoginComponent } from './user/login/login/login.component';
import { RegisterComponent } from './user/register/register/register.component';
import { UserService } from './services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

const appRoutes: Routes = [
  {path: '', component: ProjectListComponent},
  {path: 'sell-project', component: ProjectListComponent},
  {path: 'add-project', component: AddProjectComponent},
  {path: 'project-detail/:id', component: ProjectDetailComponent},
  {path: 'user/login', component: LoginComponent},
  {path: 'user/register', component: RegisterComponent},
  {path: '**', component: ProjectListComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProjectCardComponent,
    ProjectListComponent,
    AddProjectComponent,
    ProjectDetailComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    ProjectingService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
