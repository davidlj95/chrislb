import { Component } from '@angular/core'
import { MISC_IMAGES } from '../common/images/misc-images'
import { NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ToNgSrcSet } from '@/app/common/images/to-ng-src-set'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ToNgSrcSet],
})
export class LogoComponent {
  protected readonly _logo = MISC_IMAGES.horizontalLogo
}
