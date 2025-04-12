import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core'
import {
  mapSocialRefToSocialViewModel,
  SocialRefViewModel,
} from '@/app/common/social'
import { PROJECTS_PATH } from '@/app/common/routing/paths'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
import { RouterLink } from '@angular/router'
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common'
import {
  PROJECT_LIST_ITEM_SLIDES_PER_VIEW,
  ProjectListItem,
  ProjectListItemCredit,
} from '../../project'
import { PROJECT_DETAIL_PAGE_SWIPER_BY_SIZE } from '@/app/projects/project-detail-page/project-detail-page-swipers'

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
  protected readonly _item = computed<ProjectListItem>(() => ({
    ...this.item(),
    previewImages: this.item().previewImages.slice(0, this._imagesLimit),
  }))
  readonly credits = computed<readonly CreditViewModel[]>(
    () =>
      this.item().credits?.map((projectListItemCredit) => ({
        ...projectListItemCredit,
        social: projectListItemCredit.social
          ? mapSocialRefToSocialViewModel(projectListItemCredit.social)
          : undefined,
      })) ?? [],
  )

  protected readonly _PROJECTS_PATH = PROJECTS_PATH
  protected readonly _SLIDES_PER_VIEW = PROJECT_LIST_ITEM_SLIDES_PER_VIEW
  private readonly _imagesLimit = isPlatformBrowser(inject(PLATFORM_ID))
    ? Infinity
    : Math.max(
        ...Object.values(PROJECT_DETAIL_PAGE_SWIPER_BY_SIZE).map(
          (swiper) => swiper.slidesPerView,
        ),
      )
}

type CreditViewModel = Omit<ProjectListItemCredit, 'social'> & {
  social?: SocialRefViewModel
}
