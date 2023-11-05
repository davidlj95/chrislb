import defaultMetadata from '../../../data/misc/metadata.json'

export function getTitle(pageTitle: string) {
  if (!pageTitle || pageTitle.length === 0) {
    return defaultMetadata.siteName
  }
  return `${pageTitle} | ${defaultMetadata.siteName}`
}
