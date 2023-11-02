import { Component } from '@angular/core'
import { Social } from './social'
import { AuthorsService } from '../../common/authors.service'
import { SocialService } from './social.service'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent {
  public readonly items: ReadonlyArray<Social>

  constructor(authorsService: AuthorsService, socialService: SocialService) {
    this.items = socialService.getAll(authorsService.website)
  }
}
