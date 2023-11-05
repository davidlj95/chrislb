import { Component, Inject } from '@angular/core'
import aboutPageContents from '../../data/misc/about.json'
import { ImageResponsiveBreakpointsService } from '../common/images/image-responsive-breakpoints.service'
import { ImageAsset } from '../common/images/image-asset'
import { MISC_IMAGES, MiscImages } from '../common/images/misc-images'

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent {
  public readonly title: string = aboutPageContents.title
  public readonly text: string = aboutPageContents.text
  public readonly srcSet: string = this.imageResponsiveBreakpointsService
    .range(
      this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 3,
      this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 5,
    )
    .toSrcSet()
  public readonly sizes: string = 'calc(33.33vw - 16px), calc(20vw - 16px)'
  public readonly portraitImage: ImageAsset

  constructor(
    @Inject(MISC_IMAGES) miscImages: MiscImages,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {
    this.portraitImage = miscImages.aboutPortrait
  }
}
