import { ImageAsset } from 'src/data/images'

export interface ProjectItem {
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: readonly string[]
  readonly credits: readonly Credit[]
  readonly previewImages: ReadonlyArray<ImageAsset>
}

export interface Credit {
  readonly role: string
  readonly name: string
  readonly nickname: string
}

export interface ImageResource {
  readonly public_id: string
  readonly width: number
  readonly height: number
}
