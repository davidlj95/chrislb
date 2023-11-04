export class YoutubePlaylist {
  constructor(public readonly id: string) {}

  public get iframeUrl(): URL {
    const iframeUrl = new URL('https://www.youtube-nocookie.com/embed')
    iframeUrl.searchParams.set('listType', 'playlist')
    iframeUrl.searchParams.set('loop', true.toString())
    iframeUrl.searchParams.set('list', this.id)
    return iframeUrl
  }
}
