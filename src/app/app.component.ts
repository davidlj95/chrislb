import { Component } from '@angular/core'
import { ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS } from './common/style/animations'
import { RouterOutlet } from '@angular/router'
import { LogoComponent } from './logo/logo.component'
import { HeaderComponent } from './header/header.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS.children('routeAnimations'),
    ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS.element('enterLeave'),
  ],
  imports: [HeaderComponent, LogoComponent, RouterOutlet],
})
export class AppComponent {}
