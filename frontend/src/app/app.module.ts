import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { ProjectListComponent } from './project/project-list/project-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProjectCardComponent,
    ProjectListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
