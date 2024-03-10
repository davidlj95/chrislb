import { ProjectPageComponent } from './project-page/project-page.component'
import { Route } from '@angular/router'
import { ProjectPageResolver } from './project-page/project-page.resolver'
import { inject } from '@angular/core'
import { SLUG_PARAM } from './projects.routes-params'
import { ProjectRouteData } from './project-page/projects-routes-data'
import { RouteDataResolver } from '../common/routing/route-data-resolver'
import { ProjectsService } from './projects.service'

export const PROJECTS_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: `:${SLUG_PARAM}`,
    component: ProjectPageComponent,
    resolve: {
      project: (route) => inject(ProjectPageResolver).project(route),
    } as RouteDataResolver<ProjectRouteData>,
    providers: [ProjectPageResolver, ProjectsService],
  },
]
