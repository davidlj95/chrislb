import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ProjectsPageComponent } from './projects/projects-page/projects-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import projectsPageMetadata from '../data/pages/projects.json'
import notFoundPageMetadata from '../data/pages/404.json'
import { makeRouteMetadadata } from './common/routing/make-route-metadata'
import {
  ABOUT_PATH,
  NOT_FOUND_PATH,
  PROJECTS_PATH,
} from './common/routing/paths'
import { getMetadataFromJson } from './common/routing/get-metadata-from-json'
import { PROJECTS_ROUTES } from './projects/projects-routes'

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: ProjectsPageComponent,
          data: makeRouteMetadadata(projectsPageMetadata),
          pathMatch: 'full',
        },

        {
          path: PROJECTS_PATH,
          children: PROJECTS_ROUTES,
        },
        {
          path: ABOUT_PATH,
          loadChildren: () =>
            import('./about-page/about-page.module').then(
              (m) => m.AboutPageModule,
            ),
        },
        {
          path: NOT_FOUND_PATH,
          component: NotFoundPageComponent,
          data: makeRouteMetadadata(notFoundPageMetadata, NOT_FOUND_PATH),
        },
        {
          path: '**',
          component: NotFoundPageComponent,
          data: {
            NgaoxSeo: {
              ...getMetadataFromJson(notFoundPageMetadata),
              url: undefined,
            },
          },
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
