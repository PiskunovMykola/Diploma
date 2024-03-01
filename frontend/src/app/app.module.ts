import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectingService } from './services/projecting.service';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';

const appRoutes: Routes = [
  {path: '', component: ProjectListComponent},
  {path: 'sell-project', component: ProjectListComponent},
  {path: 'add-project', component: AddProjectComponent},
  {path: 'project-detail/:id', component: ProjectDetailComponent},
  {path: '**', component: ProjectListComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProjectCardComponent,
    ProjectListComponent,
    AddProjectComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    provideClientHydration(),
    ProjectingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
