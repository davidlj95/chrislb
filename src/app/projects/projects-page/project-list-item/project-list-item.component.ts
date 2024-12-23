import { Component, Input } from '@angular/core'
import { ProjectListItem } from '../../project-list-item'
import { SwiperOptions } from 'swiper/types'
import { Author, AuthorsService } from '../../../common/authors.service'
import { Social } from '../../../common/social/social'
import { SocialService } from '../../../common/social/social.service'
import { Credit } from '../../credit'
import { PROJECTS_PATH } from '../../../common/routing/paths'
import { ResponsiveImageAttributes } from '../../../common/images/responsive-image-attributes'
import { ResponsiveImageAttributesService } from '../../../common/images/responsive-image-attributes.service'
import { Vw } from '../../../common/css/unit/vw'
import { CssMinMaxMediaQuery } from '../../../common/css/css-min-max-media-query'
import { Breakpoint } from '../../../common/style/breakpoint'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
import { RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss'],
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, ImagesSwiperComponent],
})
export class ProjectListItemComponent {
  @Input() public priority?: boolean
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: 2,
  }
  public readonly responsiveImageAttributes: ResponsiveImageAttributes
  public credits?: readonly CreditItem[]
  protected readonly PROJECTS_PATH = PROJECTS_PATH

  constructor(
    private authorsService: AuthorsService,
    private socialService: SocialService,
    responsiveImageAttributesService: ResponsiveImageAttributesService,
  ) {
    this.responsiveImageAttributes = responsiveImageAttributesService
      .vw(Vw(33.33), CssMinMaxMediaQuery.min(Breakpoint.S.px))
      .concat(
        responsiveImageAttributesService.vw(
          Vw(50),
          CssMinMaxMediaQuery.max(Breakpoint.S.almost),
          { includeMediaQueryInSizes: true },
        ),
      )
      .reduce()
  }

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
}

type CreditItem = Omit<Credit, 'authorSlug'> & {
  author: Author | undefined
  social: Social | undefined
}
