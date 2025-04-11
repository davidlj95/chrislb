import { Component, computed, input } from '@angular/core'
import {
  mapSocialRefToSocialViewModel,
  SocialRefViewModel,
} from '@/app/common/social'
import { PROJECTS_PATH } from '@/app/common/routing/paths'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
import { RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'
import {
  PROJECT_LIST_ITEM_SLIDES_PER_VIEW,
  ProjectListItem,
  ProjectListItemCredit,
} from '../../project'

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

  protected readonly _PROJECTS_PATH = PROJECTS_PATH
  protected readonly _SLIDES_PER_VIEW = PROJECT_LIST_ITEM_SLIDES_PER_VIEW
}

type CreditViewModel = Omit<ProjectListItemCredit, 'social'> & {
  social?: SocialRefViewModel
}
