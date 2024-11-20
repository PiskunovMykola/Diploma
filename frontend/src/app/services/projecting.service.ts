import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IProjectBase } from '../model/iprojectbase';

@Injectable({
  providedIn: 'root'
})
export class ProjectingService {

  constructor(private http:HttpClient) { }

  getAllProjects(Sell: number): Observable<IProjectBase[]>{
    return  this.http.get('data/projects.json').pipe(
        map(data=> {
          const projectsArray: Array<IProjectBase> = [];
          const jsonData = JSON.stringify(data)
          const tmp:Array<IProjectBase> = JSON.parse(jsonData);
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
