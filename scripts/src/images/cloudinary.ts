import { ImageCdnApi, UNPUBLISHED_TAG } from './image-cdn-api'
import {
  ConfigOptions,
  ResourceApiResponse,
  v2 as cloudinary,
} from 'cloudinary'
import dotenv from 'dotenv'
import { Log } from '../utils/log'
import { CLOUD_NAME } from '../../../src/app/common/images/cdn/cloudinary'
import {
  ResponsiveImage,
  ResponsiveImageBreakpoints,
} from '../../../src/app/common/images/responsive-image'

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

    return new Cloudinary({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUD_NAME,
    })
  }

  async getAllImagesInPath(path: string): Promise<readonly ResponsiveImage[]> {
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
    const imagesWithBreakpoints: ResponsiveImage[] = []
    for (const image of images) {
      const { public_id, width, height } = image
      imagesWithBreakpoints.push({
        filename: public_id,
        width,
        height,
        breakpoints: await getImageBreakpoints({ public_id }),
      })
    }
    return imagesWithBreakpoints
  }
}

const getImageBreakpoints = async (
  imageRef: ImageRef,
): Promise<ResponsiveImageBreakpoints> => {
  const { public_id } = imageRef
  const image = (await cloudinary.api.resource(
    public_id,
  )) as ResourceDetailApiResponse
  const deriveds = image['derived']
  const unsortedBreakpoints = hasBreakpoints(deriveds)
    ? mapDerivedsToBreakpoints(deriveds)
    : await generateBreakpointsForImage(imageRef)
  return Array.from(
    new Set<number>([...unsortedBreakpoints, image.width]),
  ).toSorted((a, b) => a - b)
}

type ImageRef = Pick<ResourceApiResponseItem, 'public_id'>
type Unpacked<T> = T extends (infer U)[] ? U : T
type ResourceApiResponseItem = Unpacked<ResourceApiResponse['resources']>
type ResourceDetailApiResponse = Omit<ResourceApiResponseItem, 'derived'> & {
  readonly derived?: readonly DerivedResource[]
}

interface DerivedResource {
  readonly transformation: string
}

const hasBreakpoints = (
  deriveds: ResourceDetailApiResponse['derived'],
): deriveds is NonNullable<ResourceDetailApiResponse['derived']> => {
  if (!deriveds) {
    return false
  }
  return deriveds.some((derived) =>
    derived.transformation.startsWith(
      `${WIDTH_SCALE_TRANSFORM_PREFIX}auto:breakpoints`,
    ),
  )
}

const mapDerivedsToBreakpoints = (
  deriveds: readonly DerivedResource[],
): ResponsiveImageBreakpoints =>
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
    .filter((b): b is number => !!b)

const generateBreakpointsForImage = async ({
  public_id,
}: ImageRef): Promise<ResponsiveImageBreakpoints> => {
  Log.info(`Generating breakpoints for image "${public_id}"`)
  const response = (await cloudinary.uploader.explicit(public_id, {
    type: 'upload',
    responsive_breakpoints: {
      create_derived: true,
      bytes_step: 12288, // lighthouse
      min_width: 200,
      max_width: 1080,
    },
  })) as UploadExplicitApiResponse
  // Create them
  if (response.responsive_breakpoints.length === 0) {
    throw new Error(
      `Image ${public_id} breakpoints generation failed: no breakpoints in response`,
    )
  }
  if (response.responsive_breakpoints.length > 1) {
    Log.warn(
      `More than one breakpoint array for image ${public_id}. Using first`,
    )
  }
  const breakpointsObj = response.responsive_breakpoints[0]
  return breakpointsObj.breakpoints.map((breakpoint) => breakpoint.width)
}

const WIDTH_SCALE_TRANSFORM_PREFIX = 'c_scale,w_'
type UploadExplicitApiResponse = Pick<
  ResourceApiResponseItem,
  'public_id' | 'version'
> & {
  readonly version_id: string
  readonly signature: string
  readonly placeholder: boolean
  readonly responsive_breakpoints: readonly {
    readonly breakpoints: readonly {
      readonly width: number
      readonly height: number
      readonly bytes: number
      readonly url: string
      readonly secure_url: string
    }[]
  }[]
}
