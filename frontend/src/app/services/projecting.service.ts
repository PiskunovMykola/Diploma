import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Project } from '../model/project';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // Добавили базу

@Injectable({
  providedIn: 'root'
})
export class ProjectingService {
  
  // Внедрили private db: AngularFireDatabase
  constructor(
    private http: HttpClient, 
    private storage: AngularFireStorage,
    private db: AngularFireDatabase 
  ) { }

  // === 1. ПОЛУЧЕНИЕ ОДНОГО ПРОЕКТА ===
  getProject(id: number): Observable<Project> {
    return this.getAllProjects().pipe(
      map(projects => {
        // Добавили 'as Project' в конце
        // Это принудительно говорит TypeScript'у, что результат не будет undefined
        return projects.find(p => p.Id === id) as Project;
      })
    );
  }

  // === 2. ПОЛУЧЕНИЕ ВСЕХ ПРОЕКТОВ (из Базы Данных) ===
  getAllProjects(Sell?: number): Observable<Project[]> {
    // 'projects' — это название папки в базе, где лежат данные
    return this.db.list('projects').valueChanges().pipe(
      map((data: any[]) => {
        const projectsArray = data as Project[];

        if (!projectsArray) return [];

        if (Sell) {
          // Если передан параметр Sell (1 - продажа, 2 - аренда/покупка), фильтруем
          return projectsArray.filter(p => p.Sell === Sell);
        } else {
          return projectsArray;
        }
      })
    );
  }

  // === 3. ДОБАВЛЕНИЕ ПРОЕКТА ===
  addProject(project: Project) {
    // push создает новую запись с уникальным ключом
    this.db.list('projects').push(project);
  }
  
  // === 4. ГЕНЕРАТОР ID (пока оставим локальным для простоты) ===
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

  // === 5. ЗАГРУЗКА ФАЙЛА (оставляем как есть) ===
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

 // === 6. ОБНОВЛЕНИЕ ПРОЕКТА (С ЗАЩИТОЙ ОТ UNDEFINED) ===
  updateProject(project: Project): Promise<void> {
    const targetId = Number(project.Id);
    console.log('🔍 Попытка обновления проекта с ID:', targetId);

    const itemsRef = this.db.list('projects', ref => ref.orderByChild('Id').equalTo(targetId));
    
    return new Promise((resolve, reject) => {
      const sub = itemsRef.snapshotChanges().subscribe(items => {
        sub.unsubscribe(); // Отписываемся сразу
        
        if (items.length > 0 && items[0].key) {
          console.log('✅ Проект найден, ключ:', items[0].key);

          // === ВОТ ЗДЕСЬ МАГИЯ ===
          // Мы превращаем объект в JSON-строку и обратно.
          // Это автоматически удаляет все поля, равные undefined
          const cleanProject = JSON.parse(JSON.stringify(project)); 
          // ======================

          this.db.list('projects').update(items[0].key, cleanProject)
            .then(() => {
               console.log('🎉 Обновление успешно');
               resolve();
            })
            .catch(error => {
               console.error('❌ Ошибка Firebase:', error);
               reject(error);
            });
        } else {
          console.error('⛔ Проект не найден (проверьте ID)');
          reject('Project not found');
        }
      });
    });
  }

  // === 7. УДАЛЕНИЕ ПРОЕКТА ===
  deleteProject(id: number) {
    // 1. Ищем запись по ID
    const itemsRef = this.db.list('projects', ref => ref.orderByChild('Id').equalTo(id));
    
    // 2. Удаляем по ключу
    const sub = itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as any }))
      )
    ).subscribe(items => {
      if (items.length > 0 && items[0].key) {
        this.db.list('projects').remove(items[0].key);
        sub.unsubscribe();
      }
    });
  }
}