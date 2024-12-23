import { Component } from '@angular/core'
import projectPageMetadata from '../../data/pages/projects.json'
import aboutPageMetadata from '../../data/pages/about.json'
import { ABOUT_PATH } from '../common/routing/paths'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLinkActive, RouterLink],
})
export class HeaderComponent {
  protected readonly items: readonly NavigationItem[] = [
    {
      displayName: projectPageMetadata.title || projectPageMetadata.name,
      path: '/',
    },
    {
      displayName: aboutPageMetadata.title || aboutPageMetadata.name,
      path: ABOUT_PATH,
    },
  ]
}

export interface NavigationItem {
  readonly displayName: string
  readonly path: string
}
