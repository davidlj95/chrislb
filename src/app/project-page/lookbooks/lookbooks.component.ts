import { Component, Input } from '@angular/core'
import { ProjectLookbooksService } from './project-lookbooks.service'
import { Lookbook } from './lookbook/lookbook'

@Component({
  selector: 'app-lookbooks',
  templateUrl: './lookbooks.component.html',
  styleUrls: ['./lookbooks.component.scss'],
})
export class LookbooksComponent {
  public lookbooks!: Promise<ReadonlyArray<Lookbook>>
  protected readonly MAX_LOOKBOOKS_PER_VIEWPORT = 2

  constructor(private lookbooksService: ProjectLookbooksService) {}

  @Input({ required: true })
  public set slug(slug: string) {
    this.lookbooks = this.lookbooksService.bySlug(slug)
  }
}
