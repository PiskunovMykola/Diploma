import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IProject } from '../project/IProject.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectingService {

  constructor(private http:HttpClient) { }

  getAllProjects(Sell: number): Observable<IProject[]>{
    return  this.http.get('data/projects.json').pipe(
        map(data=> {
          const projectsArray: Array<IProject> = [];
          const jsonData = JSON.stringify(data)
          const tmp:Array<IProject> = JSON.parse(jsonData);
          for (const id in tmp){
            if (tmp[id].Sell == Sell){
              projectsArray.push(tmp[id]);
            }
          }
          return projectsArray;
        })
    );
  }
}
