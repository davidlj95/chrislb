import { Route, Routes } from '@angular/router'
import { ProjectDetailPageComponent } from './project-detail-page/project-detail-page.component'
import { ProjectDetailPageResolver } from './project-detail-page/project-detail-page-resolver.service'
import { inject } from '@angular/core'
import { SLUG_PARAM } from '@/app/common/routes-params'
import { ProjectDetailRouteData } from './project-detail-page/projects-routes-data'
import { RouteDataResolver } from '../common/routing/route-data-resolver'
import { ProjectsService } from './projects.service'
import { ProjectsListPageComponent } from './projects-list-page/projects-list-page.component'
import projectsListPageMetadata from '@/data/cms/pages/projects-list.json'
import { NgxMetaRouteData } from '@davidlj95/ngx-meta/routing'

export const PROJECTS_LIST_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsListPageComponent,
    data: { meta: projectsListPageMetadata } satisfies NgxMetaRouteData,
    pathMatch: 'full',
  },
]

export const PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      {
        path: `:${SLUG_PARAM}`,
        component: ProjectDetailPageComponent,
        resolve: {
          projectDetail: (route) =>
            inject(ProjectDetailPageResolver).projectDetail(route),
        } as RouteDataResolver<ProjectDetailRouteData>,
        providers: [ProjectDetailPageResolver, ProjectsService],
      },
    ],
  },
]
