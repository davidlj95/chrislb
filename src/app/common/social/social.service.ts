import { Injectable } from '@angular/core'
import { Social, SocialName } from './social'
import { Author } from '../authors.service'
import {
  faInstagram,
  faLinkedinIn,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons'
import { isEmpty } from 'lodash-es'

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  protected readonly mainLinkPreferences: Map<SocialName, number> = new Map(
    Object.entries([
      SocialName.Instagram,
      SocialName.LinkedIn,
      SocialName.TikTok,
    ]).map(([indexString, socialName]) => [socialName, parseInt(indexString)]),
  )

  public getAll(author: Author): ReadonlyArray<Social> {
    return this.mapAll(author.social)
  }

  public getMain(author: Author): Social | undefined {
    const socials = this.mapAll(author.social)
    if (
      author.social?.preferred &&
      this.isSocialName(author.social.preferred)
    ) {
      const mainUsername = author.social[author.social.preferred]
      if (!isEmpty(mainUsername?.trim()))
        return this.mapFromNameAndUsername(
          author.social.preferred,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          mainUsername!,
        )
    }
    const sortedSocials = Array.from(socials).sort(
      (a, b) =>
        (this.mainLinkPreferences.get(a.name) ?? 0) -
        (this.mainLinkPreferences.get(b.name) ?? 0),
    )
    if (isEmpty(sortedSocials)) {
      return
    }
    return sortedSocials[0]
  }

  private mapAll(authorSocial: Author['social']): ReadonlyArray<Social> {
    if (!authorSocial) {
      return []
    }
    const entries = Object.entries(authorSocial).filter(([name]) =>
      this.isSocialName(name),
    )
    return entries
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, username]) => !isEmpty(username?.trim()),
      )
      .map(([name, username]) =>
        this.mapFromNameAndUsername(name, username as string),
      )
  }

  private mapFromNameAndUsername(name: string, username: string): Social {
    if (!this.isSocialName(name)) {
      throw new Error(`Unknown social network name ${name}`)
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
    }
  }

  private isSocialName(name: string): name is SocialName {
    return Object.values(SocialName).includes(name as SocialName)
  }
}
