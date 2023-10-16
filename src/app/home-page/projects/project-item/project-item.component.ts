import { Component, Input } from '@angular/core'
import { ProjectItem } from './project-item'

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent {
  @Input({ required: true }) public item!: ProjectItem
}
