import { ProjectPageComponent } from './project-page/project-page.component'
import { Route } from '@angular/router'

export const PROJECTS_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: `:slug`,
    component: ProjectPageComponent,
  },
]
