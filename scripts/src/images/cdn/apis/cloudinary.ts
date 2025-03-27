import { ImageCdnApi, UNPUBLISHED_TAG } from '../image-cdn-api'
import { ConfigOptions, v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { Log } from '../../../utils/log'
import { CLOUD_NAME } from '@/app/common/images/cdn/cloudinary'
import { Image, ResponsiveImageBreakpoints } from '@/app/common/images/image'
import { SCRIPTS_CACHE_PATH } from '../../../utils/paths'
import { mkdir } from 'fs/promises'
import {
  appendJsonExtension,
  readJson,
  writeJsonSync,
} from '../../../utils/json'
import { join } from 'path'

export class Cloudinary extends ImageCdnApi {
  private constructor() {
    super()
  }

  private static _sdkOptions: ConfigOptions

  static async fromEnv(): Promise<Cloudinary> {
    if (!this._sdkOptions) {
      // Read from env
      dotenv.config()

      const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
      if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        Log.error('Either Cloudinary API key or API secret is missing')
        Log.item(
          'Add them as environment variables or to a .env file and try again',
        )
        process.exit(1)
      }

      // Read cache if exists, update it on exit
      await mkdir(SCRIPTS_CACHE_PATH, { recursive: true })
      breakpointsCache = new Map(
        Object.entries(
          await readJson(BREAKPOINTS_CACHE_FILEPATH, { fallback: {} }),
        ),
      )
      process.on('beforeExit', () => {
        writeJsonSync(
          BREAKPOINTS_CACHE_FILEPATH,
          Object.fromEntries(breakpointsCache),
        )
      })

      // Configure SDK
      this._sdkOptions = {
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        cloud_name: CLOUD_NAME,
      }
      cloudinary.config(this._sdkOptions)
    }

    return new Cloudinary()
  }

  async getAllImagesInPath(path: string): Promise<readonly CloudinaryImage[]> {
    const response = await cloudinary.api.resources_by_asset_folder(path, {
      max_results: 50, // the default right now, but to be specific & consistent over time
      resource_type: 'image',
      fields: 'width,height,tags,version', // public_id and asset_id are always included
      tags: true,
    })
    const images = response.resources
      .filter((resource) => !resource.tags.includes(UNPUBLISHED_TAG))
      .toSorted((a, b) => (a.public_id < b.public_id ? -1 : 1))
      .map(({ public_id, width, height, version }) => ({
        src: public_id,
        width,
        height,
        params: { version: version.toString() },
      }))
    Log.info('Found %d images in path "%s"', images.length, path)
    return images
  }

  override async _breakpointsForImage(
    image: CloudinaryImage,
  ): Promise<ResponsiveImageBreakpoints> {
    const imageCacheKey = getImageCacheKey(image)
    const cachedBreakpoints = breakpointsCache.get(imageCacheKey)
    if (cachedBreakpoints) {
      return cachedBreakpoints
    }
    const breakpointsUrl = cloudinary.url(image.src, {
      urlAnalytics: false,
      version: image.params.version,
      // https://cloudinary.com/documentation/transformation_reference#examples_w_auto
      raw_transformation: [
        'c_scale',
        [
          'w_auto',
          [
            'breakpoints',
            BREAKPOINTS_PARAMS.MinWidth,
            BREAKPOINTS_PARAMS.MaxWidth,
            BREAKPOINTS_PARAMS.BytesStep,
            BREAKPOINTS_PARAMS.MaxImages,
          ].join('_'),
          'json',
        ].join(':'),
      ].join(','),
    })
    const breakpointsUrlResponse = (await (
      await fetch(breakpointsUrl)
    ).json()) as JsonBreakpointsUrlResponse
    const sortedAndFullWidthBreakpoints = Array.from(
      new Set<number>([...breakpointsUrlResponse.breakpoints, image.width]),
    ).toSorted((a, b) => a - b)
    breakpointsCache.set(imageCacheKey, sortedAndFullWidthBreakpoints)
    return sortedAndFullWidthBreakpoints
  }
}

let breakpointsCache: Map<string, ResponsiveImageBreakpoints>
const BREAKPOINTS_CACHE_FILEPATH = join(
  SCRIPTS_CACHE_PATH,
  appendJsonExtension('breakpoints'),
)

type CloudinaryImage = Image & {
  readonly params: {
    readonly version: string
  }
}

const getImageCacheKey = ({
  src: public_id,
  params,
}: CloudinaryImage): string => `${public_id}@${params.version}`

const BREAKPOINTS_PARAMS = {
  MinWidth: 200,
  MaxWidth: 1920,
  BytesStep: 20,
  MaxImages: 20,
}

interface JsonBreakpointsUrlResponse {
  readonly breakpoints: readonly number[]
}
