import { Component } from '@angular/core'
import notFoundPageMetadata from '../../data/pages/404.json'

@Component({
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: true,
})
export class NotFoundPageComponent {
  readonly description: string = notFoundPageMetadata.description
}
