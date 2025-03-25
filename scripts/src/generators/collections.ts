import { ResourceCollection } from '../resources/resource-collection'
import { join } from 'path'
import { DATA_PATH } from '../utils/paths'

export class Collections {
  static readonly authors = new ResourceCollection(join(DATA_PATH, 'authors'))
  static readonly assetsCollections = new ResourceCollection(
    join(DATA_PATH, 'assets-collections'),
  )
}
