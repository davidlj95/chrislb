import { JsonMetadata } from './json-metadata'
import { MetadataRouteData } from '@davidlj95/ngx-meta/routing'
import { getCanonicalUrlForPath } from './get-canonical-url-for-path'
import { OpenGraphMetadataRouteData } from '@davidlj95/ngx-meta/open-graph'
import { getTitle } from './get-title'
import { OpenGraphProfileMetadataRouteData } from '@davidlj95/ngx-meta/open-graph-profile'

export function makeRouteMetadata(
  jsonMetadata: JsonMetadata,
  pathSegments?: string[],
): MetadataRouteData &
  OpenGraphMetadataRouteData &
  OpenGraphProfileMetadataRouteData {
  return {
    meta: {
      title: getTitle(jsonMetadata.title),
      description: jsonMetadata.description,
      keywords: jsonMetadata.keywords,
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
