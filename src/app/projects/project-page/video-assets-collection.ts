import { YoutubePlaylist } from './youtube-playlist'
import { AssetsCollection } from './assets-collection'

export interface VideoAssetsCollection extends AssetsCollection {
  readonly type: 'video'
  readonly youtubePlaylist: YoutubePlaylist
}
