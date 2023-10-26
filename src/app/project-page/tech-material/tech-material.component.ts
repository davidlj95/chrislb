import { Component, Input } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { Observable } from 'rxjs'
import { ImageAsset } from '../../../data/images/types'
import { ProjectTechMaterialService } from './project-tech-material.service'
import { DEFAULT_IMAGE_ALT } from '../../common/default-image-alt'

@Component({
  selector: 'app-tech-material',
  templateUrl: './tech-material.component.html',
  styleUrls: ['./tech-material.component.scss'],
})
export class TechMaterialComponent {
  @Input({ required: true }) set slug(slug: string) {
    this.techMaterials = this.projectTechMaterialService.bySlug(slug)
  }

  public techMaterials!: Observable<ReadonlyArray<ImageAsset>>
  public readonly swiperOptions: SwiperOptions = {
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
    slidesPerView: 1,
    breakpoints: {
      959.98: {
        slidesPerView: 2,
      },
    },
  }

  constructor(private projectTechMaterialService: ProjectTechMaterialService) {}

  protected readonly DEFAULT_IMAGE_ALT = DEFAULT_IMAGE_ALT
}
