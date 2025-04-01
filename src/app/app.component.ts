import { afterNextRender, Component, inject } from '@angular/core'
import { ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS } from './common/style/animations'
import { RouterOutlet } from '@angular/router'
import { LogoComponent } from './logo/logo.component'
import { HeaderComponent } from './header/header.component'
import { DOCUMENT } from '@angular/common'
import { BASE_URL as IMAGE_CDN_BASE_URL } from '../app/common/images/cdn'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS.children('routeAnimations'),
    ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS.element('enterLeave'),
  ],
  standalone: true,
  imports: [HeaderComponent, LogoComponent, RouterOutlet],
})
export class AppComponent {
  private _doc = inject(DOCUMENT)

  constructor() {
    // Just needed for SSG/R
    afterNextRender(() => {
      appendLinkRelPreconnect(this._doc, IMAGE_CDN_BASE_URL)
    })
  }
}

const appendLinkRelPreconnect = (doc: Document, url: string): void => {
  const linkEl = doc.createElement('link')
  linkEl.setAttribute('rel', 'preconnect')
  linkEl.setAttribute('href', url)
  // 👇 Adding as first node so it preconnects as early as possible
  doc.head.insertBefore(linkEl, doc.head.children[0])
}
