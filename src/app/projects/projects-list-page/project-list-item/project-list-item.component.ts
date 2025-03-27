import { Component, computed, input } from '@angular/core'
import {
  mapSocialRefToSocialViewModel,
  SocialRefViewModel,
} from '../../../common/social'
import { PROJECTS_PATH } from '../../../common/routing/paths'
import { BREAKPOINT_S_PX } from '../../../common/style/breakpoints'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
import { RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'
import { ProjectListItem, ProjectListItemCredit } from '../../project'
import {
  calcSizeWithoutHorizontalPagePadding,
  minWidthMediaCondition,
  px,
  sourceSize,
  sourceSizesFromList,
  vw,
} from '../../../common/css'

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
  protected readonly _sizes = sourceSizesFromList(
    sourceSize(
      calcSizeWithoutHorizontalPagePadding(vw(33.33), SLIDES_PER_VIEW),
    ),
    minWidthMediaCondition(px(BREAKPOINT_S_PX)),
    sourceSize(calcSizeWithoutHorizontalPagePadding(vw(50), SLIDES_PER_VIEW)),
  )

  protected readonly _PROJECTS_PATH = PROJECTS_PATH
}

const SLIDES_PER_VIEW = 2

type CreditViewModel = Omit<ProjectListItemCredit, 'social'> & {
  social?: SocialRefViewModel
}
