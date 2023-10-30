import { Component, Input } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../../data/images/types'
import { ProjectImagesService } from '../project-images.service'
import { ImageResponsiveBreakpointsService } from '../../common/image-responsive-breakpoints.service'
import { TECH_MATERIAL_IMAGES_FILENAME } from '../../common/files'

@Component({
  selector: 'app-tech-material',
  templateUrl: './tech-material.component.html',
  styleUrls: ['./tech-material.component.scss'],
})
export class TechMaterialComponent {
  @Input({ required: true }) set slug(slug: string) {
    this.techMaterials = this.projectImagesService.bySlugAndFilename(
      slug,
      TECH_MATERIAL_IMAGES_FILENAME,
    )
  }

  public techMaterials!: Promise<ReadonlyArray<ImageAsset>>
  public readonly srcSet = this.imageResponsiveBreakpointsService
    .range(
      this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX,
      this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 2,
    )
    .toSrcSet()
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: 1,
  }

  constructor(
    private projectImagesService: ProjectImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}
