import { Component } from '@angular/core'
import {
  mapCmsSocialToSocialViewModels,
  SocialRefViewModel,
} from '../../common/social'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import WEBSITE_AUTHOR from '@/data/cms/authors/christian-lazaro.json'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  standalone: true,
  imports: [FaIconComponent],
})
export class SocialComponent {
  readonly items: readonly SocialRefViewModel[] =
    mapCmsSocialToSocialViewModels(WEBSITE_AUTHOR.social)
}
