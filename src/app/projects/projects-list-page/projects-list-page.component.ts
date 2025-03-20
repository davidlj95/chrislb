import { Component, Signal } from '@angular/core'
import { ProjectsService } from '../projects.service'
import { ProjectListItemComponent } from './project-list-item/project-list-item.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { from } from 'rxjs'
import { ProjectListItem } from '../project'

@Component({
  templateUrl: './projects-list-page.component.html',
  styleUrls: ['./projects-list-page.component.scss'],
  standalone: true,
  imports: [ProjectListItemComponent],
  providers: [ProjectsService],
})
export class ProjectsListPageComponent {
  readonly projects: Signal<readonly ProjectListItem[]>
  protected readonly _maxProjectsPerPage = 2

  constructor(projectsService: ProjectsService) {
    this.projects = toSignal<
      readonly ProjectListItem[],
      readonly ProjectListItem[]
    >(from(projectsService.getListItems()), {
      initialValue: [],
    })
  }
}
