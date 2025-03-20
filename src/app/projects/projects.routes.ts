import { Route } from '@angular/router'
import { ProjectDetailPageComponent } from './project-detail-page/project-detail-page.component'
import { ProjectDetailPageResolver } from './project-detail-page/project-detail-page-resolver.service'
import { inject } from '@angular/core'
import { SLUG_PARAM } from './projects.routes-params'
import { ProjectRouteData } from './project-detail-page/projects-routes-data'
import { RouteDataResolver } from '../common/routing/route-data-resolver'
import { ProjectsService } from './projects.service'
import { ProjectsListPageComponent } from './projects-list-page/projects-list-page.component'
import { makeRouteMetadata } from '../common/routing/make-route-metadata'
import projectsListPageMetadata from '../../data/pages/projects-list.json'
import { PROJECTS_PATH } from '../common/routing/paths'

export const PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    component: ProjectsListPageComponent,
    data: makeRouteMetadata(projectsListPageMetadata),
    pathMatch: 'full',
  },
  {
    path: PROJECTS_PATH,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      {
        path: `:${SLUG_PARAM}`,
        component: ProjectDetailPageComponent,
        resolve: {
          project: (route) => inject(ProjectDetailPageResolver).project(route),
        } as RouteDataResolver<ProjectRouteData>,
        providers: [ProjectDetailPageResolver, ProjectsService],
      },
    ],
  },
]
