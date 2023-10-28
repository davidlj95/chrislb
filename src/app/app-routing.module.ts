import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import {
  getMetadataFromJson,
  makeRouteMetadadata,
  NOT_FOUND_PATH,
  PROJECTS_PATH,
} from './routes'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import { ProjectPageComponent } from './project-page/project-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import projectsPageMetadata from '../data/pages/projects.json'
import notFoundPageMetadata from '../data/pages/404.json'

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
          path: `${PROJECTS_PATH}/:slug`,
          component: ProjectPageComponent,
        },
        {
          path: PROJECTS_PATH,
          redirectTo: '/',
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
