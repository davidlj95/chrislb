import { Component } from '@angular/core'
import { ProjectItem } from './project-item/project-item'
import { ProjectsService } from './projects.service'

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
})
export class ProjectsPageComponent {
  public readonly projects: Promise<ReadonlyArray<ProjectItem>>

  constructor(projectsService: ProjectsService) {
    this.projects = projectsService.getAll()
  }
}
