import {
  faInstagram,
  faLinkedinIn,
  faTiktok,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { Author } from '../authors.service'

export interface Social {
  readonly name: SocialName
  readonly username: string
  readonly url: string
  readonly icon: IconDefinition
  readonly displayName: string
}

export const socialFromJson = (
  socialJson: Author['social'],
): readonly Social[] =>
  Object.entries(socialJson ?? [])
    .map(([name, username]) => {
      if (!username) {
        return
      }
      switch (name) {
        case SocialName.Instagram:
          return {
            name,
            username,
            displayName: 'Instagram',
            icon: faInstagram,
            url: new URL(`https://instagram.com/_u/${username}`).toString(),
          }
        case SocialName.LinkedIn:
          return {
            name,
            username,
            displayName: 'LinkedIn',
            icon: faLinkedinIn,
            url: new URL(`https://linkedin.com/in/${username}`).toString(),
          }
        case SocialName.TikTok:
          return {
            name,
            username,
            displayName: 'TikTok',
            icon: faTiktok,
            url: new URL(`https://tiktok.com/@${username}`).toString(),
          }
        default:
          return
      }
    })
    .filter((s): s is Social => !!s)

// To keep in sync with CMS
export enum SocialName {
  Instagram = 'instagram',
  TikTok = 'tiktok',
  LinkedIn = 'linkedin',
}
