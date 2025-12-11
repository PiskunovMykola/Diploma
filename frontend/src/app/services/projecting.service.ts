import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Project } from '../model/project';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ProjectingService {
  
  constructor(private http: HttpClient, private storage: AngularFireStorage) { }

  getProject(id: number){
    return this.getAllProjects().pipe(
      map(projectsArray =>{
        return projectsArray.find(p => p.Id === id) as Project;
      })
    );
  }

  getAllProjects(Sell?: number): Observable<Project[]> {
    return this.http.get<{ [key: string]: Project }>('data/projects.json').pipe(
      map(data => {
        const projectsArray: Array<Project> = [];

        const localProjectsString = localStorage.getItem('newProject');
        const localProjects = localProjectsString ? JSON.parse(localProjectsString) : null;

        if (localProjects) {
          // Если это массив (а addProject сохраняет массив), проходим через for..of
          if (Array.isArray(localProjects)) {
             for (const p of localProjects) {
                if(Sell){
                   if (p.Sell === Sell) projectsArray.push(p);
                } else {
                   projectsArray.push(p);
                }
             }
          } else {
             // Поддержка старого формата, если вдруг там был объект
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
        }

        for (const id in data) {
          if(Sell){
            if (Object.prototype.hasOwnProperty.call(data, id) && data[id].Sell === Sell) {
              projectsArray.push(data[id]);
            }
          } else {
            projectsArray.push(data[id]);
          }
        }

        return projectsArray;
      })
    );
  }

  addProject(project: Project) {
    let newProject = [project];
    const storedProjects = localStorage.getItem('newProject');
    if (storedProjects) {
      // Разворачиваем старый массив и добавляем новый проект в начало
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

  uploadFile(file: File): Observable<string> {
    const filePath = `project-images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            observer.next(url);
            observer.complete();
          });
        })
      ).subscribe();
    });
  }

  updateProject(project: Project) {
    const storedProjects = localStorage.getItem('newProject');
    if (storedProjects) {
      const projectsArray = JSON.parse(storedProjects) as Project[];
      const index = projectsArray.findIndex(p => p.Id === project.Id);
      if (index !== -1) {
        projectsArray[index] = project;
        localStorage.setItem('newProject', JSON.stringify(projectsArray));
      }
    }
  }

  // === НОВЫЙ МЕТОД: УДАЛЕНИЕ ===
  deleteProject(id: number) {
    const storedProjects = localStorage.getItem('newProject');
    if (storedProjects) {
      let projectsArray = JSON.parse(storedProjects) as any[];
      // Фильтруем массив: оставляем все, кроме удаляемого ID
      // Используем строгое неравенство, приводим типы если нужно
      const newArray = projectsArray.filter(p => Number(p.Id) !== Number(id));
      
      localStorage.setItem('newProject', JSON.stringify(newArray));
    }
  }
}