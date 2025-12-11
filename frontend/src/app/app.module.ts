import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router'; // Импорты роутинга
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

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
import { AuthService } from './services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProjectDetailResolverService } from './project/project-detail/project-detail-resolver.service';
import { FilterPipe } from './Pipes/filter.pipe';
import { SortPipe } from './Pipes/sort.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditPasswordComponent } from './user/edit-password/edit-password.component';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'sell-project', component: ProjectListComponent },
  { path: 'add-project', component: AddProjectComponent },
  
  // === ВОТ ЭТУ СТРОКУ МЫ ДОБАВИЛИ ===
  { path: 'edit-project/:id', component: AddProjectComponent },
  // ==================================

  { path: 'project-detail/:id', component: ProjectDetailComponent, resolve: {prj: ProjectDetailResolverService} },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'user/password', component: EditPasswordComponent },
  { path: '**', component: ProjectListComponent }
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
    LoginComponent,
    FilterPipe,
    SortPipe,
    UserProfileComponent,
    EditPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes), // Подключаем наши маршруты здесь
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    NgxGalleryModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFireStorageModule
  ],
  providers: [
    provideClientHydration(),
    ProjectingService,
    UserService,
    AuthService,
    ProjectDetailResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }