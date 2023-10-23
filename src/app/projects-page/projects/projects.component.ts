import { Component } from '@angular/core'
import { ProjectsService } from './projects.service'
import { ProjectItem } from './project-item/project-item'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  public readonly projects: Promise<ReadonlyArray<ProjectItem>>

  constructor(projectsService: ProjectsService) {
    this.projects = projectsService.getProjects()
  }
}
