import { JsonMetadata } from './json-metadata'
import { NgxMetaRouteData } from '@davidlj95/ngx-meta/routing'
import { getCanonicalUrlForPath } from './get-canonical-url-for-path'
import { getTitle } from './get-title'
import { GlobalMetadata } from '@davidlj95/ngx-meta/core'
import { OpenGraphMetadata } from '@davidlj95/ngx-meta/open-graph'
import { StandardMetadata } from '@davidlj95/ngx-meta/standard'

export function makeRouteMetadata(
  jsonMetadata: JsonMetadata,
  pathSegments?: string[],
): NgxMetaRouteData<GlobalMetadata & StandardMetadata & OpenGraphMetadata> {
  return {
    meta: {
      title: getTitle(jsonMetadata.title),
      description: jsonMetadata.description,
      canonicalUrl: pathSegments
        ? getCanonicalUrlForPath(...pathSegments)
        : null,
      image:
        !!jsonMetadata.image &&
        !!jsonMetadata.image.url &&
        !!jsonMetadata.image.alt
          ? {
              url: jsonMetadata.image.url,
              alt: jsonMetadata.image.alt,
            }
          : undefined,
      standard: {
        keywords: jsonMetadata.keywords,
      },
      openGraph: {
        image: {
          type: jsonMetadata.image?.mimeType,
          width: jsonMetadata.image?.width,
          height: jsonMetadata.image?.height,
        },
        type: jsonMetadata.openGraphType,
        profile: jsonMetadata.openGraphProfile ?? {},
      },
    },
  }
}
