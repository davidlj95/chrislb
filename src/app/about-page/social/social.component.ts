import { Component } from '@angular/core'
import { Social } from '../../common/social/social'
import { AuthorsService } from '../../common/authors.service'
import { SocialService } from '../../common/social/social.service'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { NgFor } from '@angular/common'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  imports: [NgFor, FaIconComponent],
})
export class SocialComponent {
  public readonly items: readonly Social[]

  constructor(authorsService: AuthorsService, socialService: SocialService) {
    this.items = socialService.getAll(authorsService.website)
  }
}
