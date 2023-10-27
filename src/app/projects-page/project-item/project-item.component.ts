import { Component, Input, OnChanges } from '@angular/core'
import { ProjectItem } from './project-item'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../../data/images/types'
import { ProjectPreviewImagesService } from './project-preview-images.service'
import { PROJECTS_PATH } from '../../routes'
import { ImageResponsiveBreakpointsService } from '../../common/image-responsive-breakpoints.service'

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnChanges {
  @Input({ required: true }) public item!: ProjectItem
  @Input() public priority?: boolean
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: 2,
  }
  public previewImages!: Promise<ReadonlyArray<ImageAsset>>
  public srcSet = this.imageResponsiveBreakpointsService
    .range(
      this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 2,
      this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 3,
    )
    .toSrcSet()
  protected readonly PROJECTS_PATH = PROJECTS_PATH

  constructor(
    private projectPreviewImagesService: ProjectPreviewImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}

  ngOnChanges(): void {
    this.previewImages = this.projectPreviewImagesService.bySlug(this.item.slug)
  }
}
