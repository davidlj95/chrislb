import {
  faInstagram,
  faLinkedinIn,
  faTiktok,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'

export interface CmsAuthorSocial {
  preferred?: string | null
  instagram?: string
  linkedin?: string
  tiktok?: string
}

export interface SocialRef {
  readonly netSlug: string
  readonly username: string
}

export type SocialRefViewModel = SocialRef & {
  readonly url: string
  readonly icon: IconDefinition
  readonly displayName: string
}

export const mapCmsSocialToSocialViewModels = (
  cmsAuthorSocial: CmsAuthorSocial,
): readonly SocialRefViewModel[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { preferred, ...usernameByNetSlug } = cmsAuthorSocial
  return Object.entries(usernameByNetSlug)
    .map<SocialRefViewModel | undefined>(([netSlug, username]) =>
      mapSocialRefToSocialViewModel({
        netSlug,
        username,
      }),
    )
    .filter((x) => !!x)
}

export const mapSocialRefToSocialViewModel = (
  social: SocialRef,
): SocialRefViewModel | undefined => {
  const { username, netSlug } = social
  switch (netSlug) {
    case 'instagram':
      return {
        ...social,
        displayName: 'Instagram',
        icon: faInstagram,
        url: new URL(`https://instagram.com/_u/${username}`).toString(),
      }
    case 'linkedin':
      return {
        ...social,
        displayName: 'LinkedIn',
        icon: faLinkedinIn,
        url: new URL(`https://linkedin.com/in/${username}`).toString(),
      }
    case 'tiktok':
      return {
        ...social,
        displayName: 'TikTok',
        icon: faTiktok,
        url: new URL(`https://tiktok.com/@${username}`).toString(),
      }
    default:
      return
  }
}
