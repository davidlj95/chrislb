import { ImageCdnApi, UNPUBLISHED_TAG } from './image-cdn-api'
import {
  ConfigOptions,
  ResourceApiResponse,
  v2 as cloudinary,
} from 'cloudinary'
import dotenv from 'dotenv'
import { Log } from '../utils/log'
import { CLOUDINARY_CLOUD_NAME } from '../../../src/app/common/images/cdn-config'
import {
  ImageAsset,
  ImageAssetBreakpoints,
} from '../../../src/app/common/images/image-asset'

export class Cloudinary implements ImageCdnApi {
  constructor(sdkOptions: ConfigOptions) {
    cloudinary.config(sdkOptions)
  }

  static fromEnv(): Cloudinary {
    dotenv.config()

    const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      Log.error('Either Cloudinary API key or API secret is missing')
      Log.item(
        'Add them as environment variables or to a .env file and try again',
      )
      process.exit(1)
    }

    return new this({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    })
  }

  async getAllImagesInPath(path: string): Promise<readonly ImageAsset[]> {
    const response = await cloudinary.api.resources_by_asset_folder(path, {
      max_results: 50, // the default right now, but to be specific & consistent over time
      resource_type: 'image',
      fields: 'width,height,tags', // public_id and asset_id are always included
      tags: true,
    })
    const images = response.resources
      .filter((resource) => !resource.tags.includes(UNPUBLISHED_TAG))
      .toSorted((a, b) => (a.public_id < b.public_id ? -1 : 1))
    Log.info('Found %d images in path "%s"', images.length, path)
    const imagesWithBreakpoints: ImageAsset[] = []
    for (const image of images) {
      //asset_id,
      //version,
      const { public_id, width, height } = image
      imagesWithBreakpoints.push({
        filename: public_id,
        width,
        height,
        breakpoints: await this._getImageBreakpoints(public_id),
      })
    }
    return imagesWithBreakpoints
  }

  async _getImageBreakpoints(image_id: string): Promise<ImageAssetBreakpoints> {
    const image = (await cloudinary.api.resource(
      image_id,
    )) as ResourceDetailApiResponse
    const deriveds = image['derived']
    const hasBreakpoints = (
      deriveds: ResourceDetailApiResponse['derived'],
    ): deriveds is DerivedResource[] => {
      if (!deriveds) {
        return false
      }
      return deriveds.some((derived) =>
        derived.transformation.startsWith(
          `${WIDTH_SCALE_TRANSFORM_PREFIX}auto:breakpoints`,
        ),
      )
    }
    if (!hasBreakpoints(deriveds)) {
      Log.info(`Generating breakpoints for image "${image_id}"`)
      const response = (await cloudinary.uploader.explicit(image_id, {
        type: 'upload',
        responsive_breakpoints: {
          create_derived: true,
          bytes_step: 12288, // lighthouse
          min_width: 200,
          max_width: 1080,
        },
      })) as ExplicitApiResponse
      // Create them
      if (response.responsive_breakpoints.length === 0) {
        throw new Error(
          `Image ${image_id} breakpoints generation failed: no breakpoints in response`,
        )
      }
      if (response.responsive_breakpoints.length > 1) {
        Log.warn(
          `More than one breakpoint array for image ${image_id}. Using first`,
        )
      }
      const breakpointsObj = response.responsive_breakpoints[0]
      return uniqueNumberArray(
        breakpointsObj.breakpoints.map((breakpoint) => breakpoint.width),
      ).toSorted((a, b) => a - b)
    }
    return uniqueNumberArray(
      deriveds
        .map<number | undefined>((derived) => {
          const { transformation } = derived
          if (!transformation.startsWith(WIDTH_SCALE_TRANSFORM_PREFIX)) {
            return
          }
          const widthString = transformation.substring(
            WIDTH_SCALE_TRANSFORM_PREFIX.length,
          )
          const width = parseInt(widthString)
          if (isNaN(width)) {
            return
          }
          return width
        })
        .filter((b): b is number => !!b),
    ).toSorted((a, b) => a - b)
  }
}

const WIDTH_SCALE_TRANSFORM_PREFIX = 'c_scale,w_'
type Unpacked<T> = T extends (infer U)[] ? U : T
type ResourceApiResponseItem = Unpacked<ResourceApiResponse['resources']>

type ResourceDetailApiResponse = Omit<ResourceApiResponseItem, 'derived'> & {
  derived?: readonly DerivedResource[]
}

interface DerivedResource {
  readonly transformation: string
  readonly format: string
  readonly bytes: number
  readonly id: string
  readonly url: string
  readonly secure_url: string
}

type ExplicitApiResponse = Pick<
  ResourceApiResponseItem,
  'public_id' | 'version'
> & {
  readonly version_id: string
  readonly signature: string
  readonly placeholder: boolean
  readonly responsive_breakpoints: readonly ResponsiveBreakpointItem[]
}

interface ResponsiveBreakpointItem {
  readonly breakpoints: readonly ResponsiveBreakpoint[]
}

interface ResponsiveBreakpoint {
  readonly width: number
  readonly height: number
  readonly bytes: number
  readonly url: string
  readonly secure_url: string
}

const uniqueNumberArray = (numberArray: readonly number[]): readonly number[] =>
  Array.from(new Set(numberArray))
