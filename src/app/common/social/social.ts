import { IconDefinition } from '@fortawesome/free-brands-svg-icons'

export interface Social {
  readonly name: SocialName
  readonly username: string
  readonly url: string
  readonly icon: IconDefinition
  readonly displayName: string
}

// To keep in sync with CMS
export enum SocialName {
  Instagram = 'instagram',
  TikTok = 'tiktok',
  LinkedIn = 'linkedin',
}
