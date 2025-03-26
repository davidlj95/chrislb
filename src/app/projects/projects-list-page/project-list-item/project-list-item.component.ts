import { Component, computed, input } from '@angular/core'
import {
  mapSocialRefToSocialViewModel,
  SocialRefViewModel,
} from '../../../common/social'
import { PROJECTS_PATH } from '../../../common/routing/paths'
import { ResponsiveImageAttributes } from '../../../common/images/responsive-image-attributes'
import { ResponsiveImageAttributesService } from '../../../common/images/responsive-image-attributes.service'
import { Vw } from '../../../common/css/unit/vw'
import { CssMinMaxMediaQuery } from '../../../common/css/css-min-max-media-query'
import { Breakpoint } from '../../../common/style/breakpoint'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
import { RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'
import { ProjectListItem, ProjectListItemCredit } from '../../project'

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss'],
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, ImagesSwiperComponent],
})
export class ProjectListItemComponent {
  readonly priority = input(false)
  readonly item = input.required<ProjectListItem>()
  readonly credits = computed<readonly CreditViewModel[]>(
    () =>
      this.item().credits?.map((projectListItemCredit) => ({
        ...projectListItemCredit,
        social: projectListItemCredit.social
          ? mapSocialRefToSocialViewModel(projectListItemCredit.social)
          : undefined,
      })) ?? [],
  )

  readonly responsiveImageAttributes: ResponsiveImageAttributes
  protected readonly _PROJECTS_PATH = PROJECTS_PATH

  constructor(
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

type CreditViewModel = Omit<ProjectListItemCredit, 'social'> & {
  social?: SocialRefViewModel
}
