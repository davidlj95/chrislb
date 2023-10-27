import { Component, Input } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { Observable } from 'rxjs'
import { ImageAsset } from '../../../data/images/types'
import { ProjectTechMaterialService } from './project-tech-material.service'
import { ImageResponsiveBreakpointsService } from '../../common/image-responsive-breakpoints.service'

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
    private projectTechMaterialService: ProjectTechMaterialService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}
