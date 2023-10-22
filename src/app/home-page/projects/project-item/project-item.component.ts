import { Component, Input, OnChanges } from '@angular/core'
import { ProjectItem } from './project-item'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../../../data/images'
import { ProjectService } from './project.service'

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnChanges {
  @Input({ required: true }) public item!: ProjectItem
  public readonly options: SwiperOptions = {
    pagination: {
      enabled: true,
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      enabled: true,
    },
    keyboard: {
      enabled: true,
    },
    rewind: true,
    autoplay: {
      disableOnInteraction: true,
      delay: 2500,
    },
    //loop: true,
    slidesPerView: 2,
  }
  public previewImages!: Promise<ReadonlyArray<ImageAsset>>

  constructor(private projectService: ProjectService) {}

  ngOnChanges(): void {
    this.previewImages = this.projectService.getPreviewImages(this.item.id)
  }
}
