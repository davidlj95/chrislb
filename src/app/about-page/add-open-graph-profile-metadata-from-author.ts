import { IPageSeoData } from '@ngaox/seo'
import { MetaDefinition } from '@angular/platform-browser'

interface OpenGraphProfileMetadata {
  readonly firstName: string
  readonly lastName: string
  readonly gender?: string
  readonly username?: string
}

export function addOpenGraphProfileMetadata(
  metadata: IPageSeoData,
  openGraphProfileMetadata: OpenGraphProfileMetadata,
): IPageSeoData {
  const extras: MetaDefinition[] = []
  if (isNonEmptyString(openGraphProfileMetadata.firstName)) {
    extras.push({
      property: 'og:profile:first_name',
      content: openGraphProfileMetadata.firstName,
    })
  }
  if (isNonEmptyString(openGraphProfileMetadata.lastName)) {
    extras.push({
      property: 'og:profile:last_name',
      content: openGraphProfileMetadata.lastName,
    })
  }
  if (isNonEmptyString(openGraphProfileMetadata.gender)) {
    extras.push({
      property: 'og:profile:gender',
      content: openGraphProfileMetadata.gender,
    })
  }
  if (isNonEmptyString(openGraphProfileMetadata.username)) {
    extras.push({
      property: 'og:profile:username',
      content: openGraphProfileMetadata.username,
    })
  }

  return {
    ...metadata,
    type: 'profile',
    extra: [...(metadata.extra ?? []), ...extras],
  }
}

function isNonEmptyString(string: string | undefined): string is string {
  return string !== undefined && string.trim().length > 0
}
