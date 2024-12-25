import { Injectable } from '@angular/core'
import { Social, socialFromJson, SocialName } from './social'
import { Author } from '../authors.service'

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  getAll(author: Author): readonly Social[] {
    return socialFromJson(author.social)
  }

  getMain(author: Author): Social | undefined {
    const socials = socialFromJson(author.social)
    if (!socials.length) {
      return
    }

    const preferredSocialName = author.social?.preferred
    const preferredSocial = preferredSocialName
      ? socials.find((social) => social.name === preferredSocialName)
      : undefined
    if (preferredSocial) {
      return preferredSocial
    }

    const sortedSocials = Array.from(socials).sort(
      (a, b) =>
        (MAIN_LINK_PREFERENCES.get(a.name) ?? 0) -
        (MAIN_LINK_PREFERENCES.get(b.name) ?? 0),
    )
    return sortedSocials[0]
  }
}

const MAIN_LINK_PREFERENCES = new Map<SocialName, number>(
  [SocialName.Instagram, SocialName.LinkedIn, SocialName.TikTok].map(
    (socialName, index) => [socialName, index],
  ),
)
