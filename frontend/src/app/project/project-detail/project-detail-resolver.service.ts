import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Project } from '../../model/project';
import { Observable, of } from 'rxjs';
import { ProjectingService } from '../../services/projecting.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectDetailResolverService implements Resolve<Project | null> {
  constructor(private router: Router, private projectingService: ProjectingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project | null> {
    const projId = route.params['id'];
    return this.projectingService.getProject(+projId).pipe(
      catchError((error) => {
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
