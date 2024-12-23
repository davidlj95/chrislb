import { Component } from '@angular/core'
import { ProjectsService } from '../projects.service'
import { ProjectListItem } from '../project-list-item'
import { ProjectListItemComponent } from './project-list-item/project-list-item.component'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
  imports: [ProjectListItemComponent, AsyncPipe],
  providers: [ProjectsService],
})
export class ProjectsPageComponent {
  public readonly projects: Promise<readonly ProjectListItem[]>
  protected readonly MAX_PROJECTS_PER_PAGE = 2

  constructor(projectsService: ProjectsService) {
    this.projects = projectsService.getListItems()
  }
}
