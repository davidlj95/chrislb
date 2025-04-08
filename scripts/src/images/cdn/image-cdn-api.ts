import { Image } from '@/app/common/images/image'

export abstract class ImageCdnApi {
  abstract findByPath(path: string): Promise<readonly Image[]>

  abstract getUrlSignature(
    path: string,
    opts?: GetUrlSignatureOptions,
  ): Promise<string>
}

export interface GetUrlSignatureOptions {
  breakpoint?: number
}

export const UNPUBLISHED_TAG = 'unpublished'
