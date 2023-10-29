import { Component } from '@angular/core'
import { ProjectsService } from './projects.service'
import { ProjectListItem } from './project-item/project-item'

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
})
export class ProjectsPageComponent {
  public readonly projects: Promise<ReadonlyArray<ProjectListItem>>

  constructor(projectsService: ProjectsService) {
    this.projects = projectsService.getAll()
  }
}
