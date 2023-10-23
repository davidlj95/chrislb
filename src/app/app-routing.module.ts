import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import { ProjectPageComponent } from './project-page/project-page.component'

const projectsPath = 'projects'
const routes: Routes = [
  { path: '', redirectTo: projectsPath, pathMatch: 'full' },
  {
    path: `${projectsPath}/:slug`,
    component: ProjectPageComponent,
  },
  {
    path: projectsPath,
    component: ProjectsPageComponent,
  },
  {
    path: '**',
    redirectTo: projectsPath,
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
