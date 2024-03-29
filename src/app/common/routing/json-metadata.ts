import { OpenGraphProfile, OpenGraphType } from '@davidlj95/ngx-meta/open-graph'

export interface JsonMetadata {
  readonly name: string
  readonly title: string
  readonly description: string
  readonly keywords?: string[] | undefined
  readonly image?:
    | {
        readonly url: string
        readonly alt: string
        readonly width: number
        readonly height: number
        readonly mimeType: string
      }
    | undefined
  readonly openGraphType?: OpenGraphType
  readonly openGraphProfile?: OpenGraphProfile
}
