import { Component } from '@angular/core'
import { ABOUT_PATH } from '../routes'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected readonly ABOUT_PATH = ABOUT_PATH
}
