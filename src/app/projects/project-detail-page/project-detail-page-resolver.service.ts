import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router'
import { EMPTY, tap } from 'rxjs'
import { ProjectDetail } from '../project'
import { ProjectsService } from '../projects.service'
import { NavigatorService } from '../../common/routing/navigator.service'
import { Injectable } from '@angular/core'
import { SLUG_PARAM } from '@/app/common/routes-params'

@Injectable()
export class ProjectDetailPageResolver {
  constructor(
    private readonly _projectsService: ProjectsService,
    private readonly _navigatorService: NavigatorService,
  ) {}

  projectDetail(
    route: ActivatedRouteSnapshot,
  ): ReturnType<ResolveFn<ProjectDetail>> {
    const slug = route.paramMap.get(SLUG_PARAM)
    if (!slug) {
      this._navigatorService.displayNotFoundPage()
      return EMPTY
    }
    return this._projectsService.getDetail(slug!).pipe(
      tap({
        error: () => {
          this._navigatorService.displayNotFoundPage()
        },
      }),
    )
  }
}
