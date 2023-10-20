import { Component, Input } from '@angular/core'
import { ProjectItem } from './project-item'
import { SwiperOptions } from 'swiper/types'

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent {
  @Input({ required: true }) public item!: ProjectItem
  public readonly options: SwiperOptions = {
    slidesPerView: 'auto',
    pagination: {
      enabled: true,
      clickable: true,
    },
    navigation: {
      enabled: true,
    },
    keyboard: {
      enabled: true,
    },
    //rewind: true,
    // autoplay: {
    //   disableOnInteraction: false,
    //   delay: 2500,
    // },
    // loop: true,
  }
}
