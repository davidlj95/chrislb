import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ProjectsPageComponent } from './projects/projects-page/projects-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import projectsPageMetadata from '../data/pages/projects.json'
import notFoundPageMetadata from '../data/pages/404.json'
import { makeRouteMetadata } from './common/routing/make-route-metadata'
import {
  ABOUT_PATH,
  NOT_FOUND_PATH,
  PROJECTS_PATH,
} from './common/routing/paths'
import { PROJECTS_ROUTES } from './projects/projects.routes'

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: ProjectsPageComponent,
          data: makeRouteMetadata(projectsPageMetadata, []),
          pathMatch: 'full',
        },

        {
          path: PROJECTS_PATH,
          children: PROJECTS_ROUTES,
        },
        {
          path: ABOUT_PATH,
          loadChildren: () =>
            import('./about-page/about-page.routes').then(
              (m) => m.ABOUT_ROUTES,
            ),
        },
        {
          path: NOT_FOUND_PATH,
          component: NotFoundPageComponent,
          data: makeRouteMetadata(notFoundPageMetadata, [NOT_FOUND_PATH]),
        },
        {
          path: '**',
          component: NotFoundPageComponent,
          data: makeRouteMetadata(notFoundPageMetadata),
        },
      ],
      {
        initialNavigation: 'enabledBlocking',
        bindToComponentInputs: true,
        scrollPositionRestoration: 'enabled',
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
