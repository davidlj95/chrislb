import { Component } from '@angular/core'
import meta from '../../data/meta.json'

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent {
  public readonly description: string = meta.notFound.description
}
