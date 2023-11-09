import { IPageSeoData } from '@ngaox/seo'
import { MetaDefinition } from '@angular/platform-browser'
import { isEmpty } from 'lodash-es'

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
  if (!isEmpty(openGraphProfileMetadata.firstName)) {
    extras.push({
      property: 'og:profile:first_name',
      content: openGraphProfileMetadata.firstName,
    })
  }
  if (!isEmpty(openGraphProfileMetadata.lastName.trim())) {
    extras.push({
      property: 'og:profile:last_name',
      content: openGraphProfileMetadata.lastName,
    })
  }
  if (!isEmpty(openGraphProfileMetadata.gender?.trim())) {
    extras.push({
      property: 'og:profile:gender',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      content: openGraphProfileMetadata.gender!,
    })
  }
  if (!isEmpty(openGraphProfileMetadata.username?.trim())) {
    extras.push({
      property: 'og:profile:username',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      content: openGraphProfileMetadata.username!,
    })
  }

  return {
    ...metadata,
    type: 'profile',
    extra: [...(metadata.extra ?? []), ...extras],
  }
}
