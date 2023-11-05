import { YoutubePlaylist } from './youtube-playlist'
import { AssetsCollectionData } from './assets-collection-data'
import { AssetsCollectionType } from './assets-collection-type'
import { AssetsCollection } from './assets-collection'

export class VideoAssetsCollection implements AssetsCollection {
  public readonly type = AssetsCollectionType.Video

  constructor(
    public readonly data: AssetsCollectionData,
    public readonly youtubePlaylist: YoutubePlaylist,
  ) {}
}
