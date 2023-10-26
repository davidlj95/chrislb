import { Component, Inject, InjectionToken } from '@angular/core'
import { LogoImages } from '../../data/images/types'
import logoImages from '../../data/images/logos.json'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  constructor(@Inject(LOGO_IMAGES) public logoImages: LogoImages) {}
}

const LOGO_IMAGES = new InjectionToken<LogoImages>('Logo images', {
  factory: () => logoImages,
})
