import { ResponsiveImage } from '../../../src/app/common/images/responsive-image'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<readonly ResponsiveImage[]>
}

export const UNPUBLISHED_TAG = 'unpublished'
