import { Component, Input } from '@angular/core'
import { Lookbook, ProjectLookbooksService } from './project-lookbooks.service'
import { Router } from '@angular/router'
import { displayNotFound } from '../routes'
import { noop } from 'rxjs'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  @Input({ required: true })
  public set slug(slug: string) {
    this.lookbooks = this.projectsLookbooksService
      .bySlug(slug)
      .then((lookbooks) => {
        if (lookbooks.length == 0) {
          displayNotFound(this.router).then(noop)
        }
        return lookbooks
      })
  }

  public lookbooks!: Promise<ReadonlyArray<Lookbook>>

  constructor(
    private projectsLookbooksService: ProjectLookbooksService,
    private router: Router,
  ) {}
}
