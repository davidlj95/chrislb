import { Component } from '@angular/core'
import aboutPageContents from '@/data/cms/misc/about.json'
import { MISC_IMAGES } from '../common/images/misc-images'
import defaultMetadata from '@/data/cms/misc/metadata.json'
import { BREAKPOINT_S_PX, BREAKPOINT_XS_PX } from '../common/style/breakpoints'
import { NgOptimizedImage } from '@angular/common'
import { ResumeComponent } from './resume/resume.component'
import { SocialComponent } from './social/social.component'
import { ToNgSrcSet } from '../common/images/to-ng-src-set'
import {
  calcSizeWithoutHorizontalPagePadding,
  minWidthMediaCondition,
  px,
  sourceSize,
  sourceSizesFromList,
  vw,
} from '../common/css'

@Component({
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  standalone: true,
  imports: [SocialComponent, ResumeComponent, NgOptimizedImage, ToNgSrcSet],
})
export class AboutPageComponent {
  protected readonly _title: string = aboutPageContents.title
  protected readonly _text: string = aboutPageContents.text
  protected readonly _emailLocalPart: string = 'contact'
  protected readonly _domainName = new URL(defaultMetadata.canonicalUrl)
    .hostname
  protected readonly _portrait = MISC_IMAGES.aboutPortrait
  protected readonly _sizes = sourceSizesFromList(
    sourceSize(
      calcSizeWithoutHorizontalPagePadding(vw(35)),
      minWidthMediaCondition(px(BREAKPOINT_S_PX)),
    ),
    sourceSize(
      calcSizeWithoutHorizontalPagePadding(vw(60)),
      minWidthMediaCondition(px(BREAKPOINT_XS_PX)),
    ),
    sourceSize(calcSizeWithoutHorizontalPagePadding(vw(75))),
  )
}
