import { YoutubePlaylist } from './youtube-playlist'
import { AssetsCollectionData } from './assets-collection-data'
import { AssetsCollectionType } from './assets-collection-type'
import { AssetsCollection } from './assets-collection'

export class VideoAssetsCollection implements AssetsCollection {
  readonly type = AssetsCollectionType.Video

  constructor(
    readonly data: AssetsCollectionData,
    readonly youtubePlaylist: YoutubePlaylist,
  ) {}
}
