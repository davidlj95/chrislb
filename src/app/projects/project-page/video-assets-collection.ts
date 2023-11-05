import { YoutubePlaylist } from './youtube-playlist'
import { AssetsCollection } from './assets-collection'

export interface VideoAssetsCollection extends AssetsCollection {
  readonly youtubePlaylist: YoutubePlaylist
}
