import { Component, Input } from '@angular/core'
import { Credit, ProjectItem } from './project-item'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../../data/images/types'
import { ProjectPreviewImagesService } from './project-preview-images.service'
import { PROJECTS_PATH } from '../../routes'
import { ImageResponsiveBreakpointsService } from '../../common/image-responsive-breakpoints.service'
import { Author, AuthorsService } from '../../common/authors.service'

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent {
  protected _item!: ProjectItem
  @Input({ required: true })
  public set item(item: ProjectItem) {
    this._item = item
    this.previewImages = this.projectPreviewImagesService.bySlug(item.slug)
    this.credits = item.credits.map((credit) => ({
      ...credit,
      author: this.authorsService.bySlug(credit.authorSlug),
    }))
  }

  @Input() public priority?: boolean
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: 2,
  }
  public previewImages!: Promise<ReadonlyArray<ImageAsset>>
  public srcSet = this.imageResponsiveBreakpointsService
    .range(
      this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 2,
      this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 3,
    )
    .toSrcSet()
  public credits!: ReadonlyArray<CreditItem>
  protected readonly PROJECTS_PATH = PROJECTS_PATH

  constructor(
    private projectPreviewImagesService: ProjectPreviewImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
    private authorsService: AuthorsService,
  ) {}
}

type CreditItem = Omit<Credit, 'authorSlug'> & {
  author: Author | undefined
}
