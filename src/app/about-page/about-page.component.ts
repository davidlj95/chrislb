import { Component, Inject } from '@angular/core'
import aboutPageContents from '../../data/misc/about.json'
import { MISC_IMAGES, MiscImages } from '../common/images/misc-images'
import defaultMetadata from '../../data/misc/metadata.json'
import { ResponsiveImage } from '../common/images/responsive-image'
import { ResponsiveImageAttributesService } from '../common/images/responsive-image-attributes.service'
import { Vw } from '../common/css/unit/vw'
import { CssMinMaxMediaQuery } from '../common/css/css-min-max-media-query'
import { Breakpoint } from '../common/style/breakpoint'
import { NgOptimizedImage } from '@angular/common'
import { ResumeComponent } from './resume/resume.component'
import { SocialComponent } from './social/social.component'

@Component({
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  standalone: true,
  imports: [SocialComponent, ResumeComponent, NgOptimizedImage],
})
export class AboutPageComponent {
  readonly title: string = aboutPageContents.title
  readonly text: string = aboutPageContents.text
  readonly emailLocalPart: string = 'contact'
  readonly domainName = new URL(defaultMetadata.canonicalUrl).hostname
  readonly portrait: ResponsiveImage

  constructor(
    @Inject(MISC_IMAGES) miscImages: MiscImages,
    responsiveImageAttributesService: ResponsiveImageAttributesService,
  ) {
    //👇 Keep in sync with SCSS
    this.portrait = new ResponsiveImage(
      miscImages.aboutPortrait,
      responsiveImageAttributesService
        .vw(Vw(35), CssMinMaxMediaQuery.min(Breakpoint.S.px))
        .concat(
          responsiveImageAttributesService.vw(
            Vw(60),
            CssMinMaxMediaQuery.minMax(Breakpoint.Xs.px, Breakpoint.S.almost),
            { includeMediaQueryInSizes: true },
          ),
          responsiveImageAttributesService.vw(
            Vw(75),
            CssMinMaxMediaQuery.max(Breakpoint.Xs.almost),
            { includeMediaQueryInSizes: true },
          ),
        )
        .reduce(),
    )
  }
}
