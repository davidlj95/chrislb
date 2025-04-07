import { Component } from '@angular/core'
import aboutPageContents from '@/data/cms/misc/about.json'
import { MISC_IMAGES } from '../common/images/misc-images'
import defaultMetadata from '@/data/cms/misc/metadata.json'
import { NgOptimizedImage } from '@angular/common'
import { ResumeComponent } from './resume/resume.component'
import { SocialComponent } from './social/social.component'
import { ToNgSrcSet } from '@/app/common/images/to-ng-src-set'
import { ToLoaderParams } from '@/app/common/images/loader-params'

@Component({
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  standalone: true,
  imports: [
    SocialComponent,
    ResumeComponent,
    NgOptimizedImage,
    ToNgSrcSet,
    ToLoaderParams,
  ],
})
export class AboutPageComponent {
  protected readonly _title: string = aboutPageContents.title
  protected readonly _text: string = aboutPageContents.text
  protected readonly _emailLocalPart: string = 'contact'
  protected readonly _domainName = new URL(defaultMetadata.canonicalUrl)
    .hostname
  protected readonly _portrait = MISC_IMAGES.aboutPortrait
}
