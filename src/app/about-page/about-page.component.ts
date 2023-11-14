import { Component, Inject, OnInit } from '@angular/core'
import aboutPageContents from '../../data/misc/about.json'
import { MISC_IMAGES, MiscImages } from '../common/images/misc-images'
import defaultMetadata from '../../data/misc/metadata.json'
import { ResponsiveImage } from '../common/images/responsive-image'
import { ResponsiveImageAttributesService } from '../common/images/responsive-image-attributes.service'
import { Vw } from '../common/css/unit/vw'
import { CssMinMaxMediaQuery } from '../common/css/css-min-max-media-query'
import { Breakpoint } from '../common/style/breakpoint'
import { MetadataService } from '@davidlj95/ngx-meta/core'
import { OpenGraphProfileMetadata } from '@davidlj95/ngx-meta/open-graph-profile'

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {
  public readonly title: string = aboutPageContents.title
  public readonly text: string = aboutPageContents.text
  public readonly portrait: ResponsiveImage
  public readonly emailLocalPart: string = 'contact'
  public readonly domainName = new URL(defaultMetadata.canonicalUrl).hostname
  private readonly openGraphProfileMetadata: OpenGraphProfileMetadata =
    aboutPageContents.openGraphProfile

  constructor(
    @Inject(MISC_IMAGES) miscImages: MiscImages,
    responsiveImageAttributesService: ResponsiveImageAttributesService,
    private readonly metadataService: MetadataService,
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

  ngOnInit(): void {
    this.metadataService.set({
      openGraph: { profile: this.openGraphProfileMetadata },
    })
  }
}
