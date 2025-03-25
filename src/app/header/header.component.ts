import { Component } from '@angular/core'
import projectsListPageMetadata from '../../../data/cms/pages/projects-list.json'
import aboutPageMetadata from '../../../data/cms/pages/about.json'
import { ABOUT_PATH } from '../common/routing/paths'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
})
export class HeaderComponent {
  readonly items: readonly NavigationItem[] = [
    {
      displayName:
        projectsListPageMetadata.title || projectsListPageMetadata.name,
      path: '/',
    },
    {
      displayName: aboutPageMetadata.title || aboutPageMetadata.name,
      path: ABOUT_PATH,
    },
  ]
}

interface NavigationItem {
  readonly displayName: string
  readonly path: string
}
