import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import {
  getCanonicalUrlForPath,
  NOT_FOUND_DATA,
  NOT_FOUND_PATH,
  PROJECTS_PATH,
} from './routes'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import meta from '../data/meta.json'
import { ProjectPageComponent } from './project-page/project-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: ProjectsPageComponent,
          data: {
            NgaoxSeo: {
              title: meta.default.siteName,
              description: meta.default.description,
              keywords: meta.default.keywords,
              url: getCanonicalUrlForPath(''),
            },
          },
          pathMatch: 'full',
        },
        {
          path: `${PROJECTS_PATH}/:slug`,
          component: ProjectPageComponent,
        },
        {
          path: NOT_FOUND_PATH,
          component: NotFoundPageComponent,
          data: {
            NOT_FOUND_DATA,
            url: getCanonicalUrlForPath(NOT_FOUND_PATH),
          },
        },
        {
          path: '**',
          component: NotFoundPageComponent,
          data: NOT_FOUND_DATA,
        },
      ],
      {
        initialNavigation: 'enabledBlocking',
        bindToComponentInputs: true,
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
