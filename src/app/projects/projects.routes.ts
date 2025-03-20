import { Route } from '@angular/router'
import { ProjectDetailPageComponent } from './project-detail-page/project-detail-page.component'
import { ProjectDetailPageResolver } from './project-detail-page/project-detail-page-resolver.service'
import { inject } from '@angular/core'
import { SLUG_PARAM } from './projects.routes-params'
import { ProjectRouteData } from './project-detail-page/projects-routes-data'
import { RouteDataResolver } from '../common/routing/route-data-resolver'
import { ProjectsService } from './projects.service'

export const PROJECTS_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: `:${SLUG_PARAM}`,
    component: ProjectDetailPageComponent,
    resolve: {
      project: (route) => inject(ProjectDetailPageResolver).project(route),
    } as RouteDataResolver<ProjectRouteData>,
    providers: [ProjectDetailPageResolver, ProjectsService],
  },
]
