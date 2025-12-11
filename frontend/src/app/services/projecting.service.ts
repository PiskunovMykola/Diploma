import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators'; // Добавил finalize
import { Observable } from 'rxjs';
import { Project } from '../model/project';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Добавил импорт Firebase Storage

@Injectable({
  providedIn: 'root'
})
export class ProjectingService {
  
  // Добавил private storage: AngularFireStorage в конструктор
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

  // === ЭТОТ МЕТОД НУЖЕН ДЛЯ ЗАГРУЗКИ КАРТИНКИ ===
  uploadFile(file: File): Observable<string> {
    const filePath = `project-images/${Date.now()}_${file.name}`; // Генерируем уникальное имя
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Возвращаем поток, который вернет URL картинки после полной загрузки
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
  
}