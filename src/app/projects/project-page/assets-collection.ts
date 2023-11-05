import { AssetsCollectionType } from './assets-collection-type'
import { AssetsCollectionData } from './assets-collection-data'

export interface AssetsCollection {
  readonly data: AssetsCollectionData
  readonly type: AssetsCollectionType
}
