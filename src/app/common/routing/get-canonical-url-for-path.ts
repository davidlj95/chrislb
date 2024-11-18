import defaultMetadata from '../../../data/misc/metadata.json'

export function getCanonicalUrlForPath(...pathSegments: readonly string[]) {
  return new URL(
    pathSegments.join('/'),
    new URL(defaultMetadata.canonicalUrl),
  ).toString()
}
