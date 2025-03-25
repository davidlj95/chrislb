import defaultMetadata from '../../../../data/cms/misc/metadata.json'
import { isEmpty } from 'lodash-es'

export function getTitle(pageTitle: string | undefined | null) {
  if (isEmpty(pageTitle?.trim())) {
    return defaultMetadata.siteName
  }
  return `${pageTitle} | ${defaultMetadata.siteName}`
}
