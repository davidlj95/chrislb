import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router'
import { EMPTY, tap } from 'rxjs'
import { Project } from '../project'
import { ProjectsService } from '../projects.service'
import { SLUG_PARAM } from '../projects.routes-params'
import { NavigatorService } from '../../common/routing/navigator.service'
import { Injectable } from '@angular/core'

@Injectable()
export class ProjectPageResolver {
  constructor(
    private readonly _projectsService: ProjectsService,
    private readonly _navigatorService: NavigatorService,
  ) {}

  project(route: ActivatedRouteSnapshot): ReturnType<ResolveFn<Project>> {
    const slug = route.paramMap.get(SLUG_PARAM)
    if (!slug) {
      this._navigatorService.displayNotFoundPage()
      return EMPTY
    }
    return this._projectsService.bySlug(slug!).pipe(
      tap({
        error: () => {
          this._navigatorService.displayNotFoundPage()
        },
      }),
    )
  }
}
