import { Component } from '@angular/core'
import { ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS } from './common/animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS.children('routeAnimations'),
    ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS.element('enterLeave'),
  ],
})
export class AppComponent {}
