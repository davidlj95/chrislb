import { Component, Signal } from '@angular/core'
import { ProjectsService } from '../projects.service'
import { ProjectListItem } from '../project-list-item'
import { ProjectListItemComponent } from './project-list-item/project-list-item.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { from } from 'rxjs'

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
  standalone: true,
  imports: [ProjectListItemComponent],
  providers: [ProjectsService],
})
export class ProjectsPageComponent {
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
