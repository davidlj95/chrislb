import { IPageSeoData } from '@ngaox/seo'
import { Author } from '../common/authors.service'
import { MetaDefinition } from '@angular/platform-browser'

export function addOpenGraphProfileMetadataFromAuthor(
  metadata: IPageSeoData,
  author: Author,
): IPageSeoData {
  const extras: MetaDefinition[] = []
  if (author.firstName && author.firstName.length > 0) {
    extras.push({
      property: 'og:profile:first_name',
      content: author.firstName,
    })
  }
  if (author.lastName && author.lastName.length > 0) {
    extras.push({
      property: 'og:profile:last_name',
      content: author.lastName,
    })
  }
  if (author.gender && author.gender.length > 0) {
    extras.push({
      property: 'og:profile:gender',
      content: author.gender,
    })
  }
  if (author.social?.mainUsername && author.social.mainUsername.length > 0) {
    extras.push({
      property: 'og:profile:username',
      content: author.social.mainUsername,
    })
  }

  return {
    ...metadata,
    type: 'profile',
    extra: [...(metadata.extra ?? []), ...extras],
  }
}
