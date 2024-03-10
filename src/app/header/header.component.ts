import { Component } from '@angular/core'
import projectPageMetadata from '../../data/pages/projects.json'
import aboutPageMetadata from '../../data/pages/about.json'
import { ABOUT_PATH } from '../common/routing/paths'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { NgFor } from '@angular/common'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgFor, RouterLinkActive, RouterLink],
})
export class HeaderComponent {
  protected readonly items: ReadonlyArray<NavigationItem> = [
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
