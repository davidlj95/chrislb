import { Component, computed, input } from '@angular/core'
import { ProjectListItem } from '../../project-list-item'
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
import { RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'
import { ImagesSwiperGlidejsComponent } from '../../images-swiper-glidejs/images-swiper-glidejs.component'

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss'],
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, ImagesSwiperGlidejsComponent],
})
export class ProjectListItemComponent {
  readonly item = input.required<ProjectListItem>()
  readonly priority = input(false)
  readonly credits = computed<readonly CreditItem[]>(
    () =>
      this.item().credits?.map((credit) => {
        const author = this._authorsService.bySlug(credit.authorSlug)
        const social = author ? this._socialService.getMain(author) : undefined
        return {
          ...credit,
          author,
          social,
        }
      }) ?? [],
  )

  readonly responsiveImageAttributes: ResponsiveImageAttributes
  protected readonly _PROJECTS_PATH = PROJECTS_PATH

  constructor(
    private readonly _authorsService: AuthorsService,
    private readonly _socialService: SocialService,
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
}

type CreditItem = Omit<Credit, 'authorSlug'> & {
  author: Author | undefined
  social: Social | undefined
}
