import { Component, Input, OnChanges } from '@angular/core'
import { ProjectItem } from './project-item'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../../../data/images/types'
import { ProjectPreviewImagesService } from '../project-preview-images.service'

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnChanges {
  @Input({ required: true }) public item!: ProjectItem
  @Input() public priorityPreviewImages = false
  public readonly SLIDES_PER_VIEW = 2
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
    slidesPerView: this.SLIDES_PER_VIEW,
  }
  public previewImages!: Promise<ReadonlyArray<ImageAsset>>

  constructor(
    private projectPreviewImagesService: ProjectPreviewImagesService,
  ) {}

  ngOnChanges(): void {
    this.previewImages = this.projectPreviewImagesService.byId(this.item.id)
  }
}
