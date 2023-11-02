import { Injectable } from '@angular/core'
import { Social } from './social'
import { Author } from '../../common/authors.service'
import {
  faInstagram,
  faLinkedinIn,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons'

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  public getAll(author: Author): ReadonlyArray<Social> {
    const entries = Object.entries(author.social)
    return entries
      .filter(
        ([name, username]) =>
          !!name && name.length > 0 && !!username && username.length > 0,
      )
      .map(([name, username]) => this.mapFromNameAndUsername(name, username))
  }

  private mapFromNameAndUsername(name: string, username: string): Social {
    if (name === 'instagram') {
      return {
        displayName: 'Instagram',
        icon: faInstagram,
        url: new URL(`https://instagram.com/_u/${username}`),
      }
    }
    if (name === 'linkedin') {
      return {
        displayName: 'LinkedIn',
        icon: faLinkedinIn,
        url: new URL(`https://linkedin.com/in/${username}`),
      }
    }
    if (name === 'tiktok') {
      return {
        displayName: 'TikTok',
        icon: faTiktok,
        url: new URL(`https://tiktok.com/@${username}`),
      }
    }
    throw new Error(`Unknown social network name ${name}`)
  }
}
