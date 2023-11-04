import { Component, Input } from '@angular/core'
import { ProjectListItem } from '../../project-list-item'
import { SwiperOptions } from 'swiper/types'
import { PROJECTS_PATH } from '../../../routes'
import { ImageResponsiveBreakpointsService } from '../../../common/image-responsive-breakpoints.service'
import { Author, AuthorsService } from '../../../common/authors.service'
import { Social } from '../../../about-page/social/social'
import { SocialService } from '../../../about-page/social/social.service'
import { Credit } from '../../credit'

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss'],
})
export class ProjectListItemComponent {
  protected _item!: ProjectListItem
  @Input({ required: true })
  public set item(item: ProjectListItem) {
    this._item = item
    this.credits = item.credits?.map((credit) => {
      const author = this.authorsService.bySlug(credit.authorSlug)
      const social = author ? this.socialService.getMain(author) : undefined
      return {
        ...credit,
        author,
        social,
      }
    })
  }

  @Input() public priority?: boolean
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: 2,
  }
  public srcSet = this.imageResponsiveBreakpointsService
    .range(
      this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 2,
      this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 3,
    )
    .toSrcSet()
  public credits?: ReadonlyArray<CreditItem>
  protected readonly PROJECTS_PATH = PROJECTS_PATH

  constructor(
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
    private authorsService: AuthorsService,
    private socialService: SocialService,
  ) {}
}

type CreditItem = Omit<Credit, 'authorSlug'> & {
  author: Author | undefined
  social: Social | undefined
}
