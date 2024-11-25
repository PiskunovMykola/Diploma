import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IProjectBase } from '../model/iprojectbase';
import { IProject } from '../model/iproject';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectingService {

  constructor(private http: HttpClient) { }
  getProject(id: number){
    return this.getAllProjects().pipe(
      map(projectsArray =>{
        return projectsArray.find(p=>p.Id === id) as Project;
      })
    );
  }
  getAllProjects(Sell?: number): Observable<IProjectBase[]> {
    return this.http.get<{ [key: string]: IProjectBase }>('data/projects.json').pipe(
      map(data => {
        const projectsArray: Array<IProjectBase> = [];

        const localProjectsString = localStorage.getItem('newProject');
        const localProjects = localProjectsString ? JSON.parse(localProjectsString) : null;

        if (localProjects) {
          for (const id in localProjects) {
            if(Sell){
            if (localProjects.hasOwnProperty(id) && localProjects[id].Sell === Sell) {
              projectsArray.push(localProjects[id]);
            }
          }
          else{
            projectsArray.push(localProjects[id]);
          }
        }
        }

        for (const id in data) {
          if(Sell){
          if (Object.prototype.hasOwnProperty.call(data, id) && data[id].Sell === Sell) {
            projectsArray.push(data[id]);
          }
        }else{
          projectsArray.push(data[id]);
        }
        }

        return projectsArray;
      })
    );

    return this.http.get<IProject[]>('data/projects.json');
  }


  addProject(project: Project) {
    let newProject = [project];
  
    const storedProjects = localStorage.getItem('newProject');
    if (storedProjects) {
      newProject = [project, ...JSON.parse(storedProjects)];
    }
  
    localStorage.setItem('newProject', JSON.stringify(newProject));
  }
  
  newProjID(): number {
    const pid = localStorage.getItem('PID');
    
    if (pid !== null) {
      const newPid = +pid + 1;
      localStorage.setItem('PID', String(newPid));
      return newPid;
    } else {
      localStorage.setItem('PID', '101');
      return 101;
    }
  }
  
  
}
