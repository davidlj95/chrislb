import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  @Input({ required: true }) public slug!: string
}
