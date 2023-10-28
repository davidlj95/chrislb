import { Component } from '@angular/core'
import notFoundPageMetadata from '../../data/pages/not-found.json'

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent {
  public readonly description: string = notFoundPageMetadata.description
}
