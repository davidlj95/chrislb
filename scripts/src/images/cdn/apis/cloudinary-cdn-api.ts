import {
  GetUrlSignatureOptions,
  ImageCdnApi,
  UNPUBLISHED_TAG,
} from '../image-cdn-api'
import { ConfigOptions, v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { Log } from '../../../utils/log'
import {
  CLOUD_NAME,
  getRawTransformationForBreakpoint,
  IMAGE_DELIVERY_TYPE,
} from '@/app/common/images/cdn/cloudinary'
import { Breakpoints, Image } from '@/app/common/images/image'
import { SCRIPTS_CACHE_PATH } from '../../../utils/paths'
import { mkdir } from 'fs/promises'
import {
  appendJsonExtension,
  readJson,
  writeJsonSync,
} from '../../../utils/json'
import { join } from 'path'

export class CloudinaryCdnApi implements ImageCdnApi {
  private static _sdkOptions: ConfigOptions

  static async getInstance(): Promise<CloudinaryCdnApi> {
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

    return new CloudinaryCdnApi()
  }

  async findByPath(path: string): Promise<readonly Image[]> {
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
        src: `${VERSION_SEGMENT_PREFIX}${version}/${public_id}`,
        width,
        height,
      }))
    Log.info('Found %d images in path "%s"', images.length, path)
    return images
  }

  async breakpointsForImage(image: Image): Promise<Breakpoints> {
    const cachedBreakpoints = breakpointsCache.get(image.src)
    if (cachedBreakpoints) {
      return cachedBreakpoints
    }

    const breakpointsUrl = cloudinary.url(image.src, {
      urlAnalytics: false,
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

    breakpointsCache.set(image.src, sortedAndFullWidthBreakpoints)
    return sortedAndFullWidthBreakpoints
  }

  async getUrlSignature(
    publicId: string,
    { breakpoint }: GetUrlSignatureOptions,
  ) {
    // Seems there's no way to get the raw sig using Cloudinary's Node.js SDK
    // https://github.com/cloudinary/cloudinary_npm/blob/2.6.0/lib/utils/index.js#L894-L898
    // So extracting it from the URL instead to avoid signing manually
    const imageUrl = cloudinary.url(publicId, {
      urlAnalytics: false,
      sign_url: true,
      type: IMAGE_DELIVERY_TYPE,
      raw_transformation: getRawTransformationForBreakpoint(breakpoint),
    })
    const paths = new URL(imageUrl).pathname.substring(1).split('/')
    if (!(paths.length > SIGNATURE_INDEX_IN_PATH)) {
      throw new Error(`Cannot find signature in image URL "${imageUrl}"`)
    }
    const signature = paths[3]
    if (
      !signature.startsWith(SIGNATURE_PREFIX) ||
      !signature.endsWith(SIGNATURE_SUFFIX)
    ) {
      throw new Error(
        `Signature does not have an expected format: "${signature}"`,
      )
    }
    return signature
  }
}

const VERSION_SEGMENT_PREFIX = 'v'

const SIGNATURE_INDEX_IN_PATH = 3
const SIGNATURE_PREFIX = 's--'
const SIGNATURE_SUFFIX = '--'

let breakpointsCache: Map<string, Breakpoints>
const BREAKPOINTS_CACHE_FILEPATH = join(
  SCRIPTS_CACHE_PATH,
  appendJsonExtension('breakpoints'),
)

const BREAKPOINTS_PARAMS = {
  MinWidth: 200,
  MaxWidth: 1920,
  BytesStep: 20,
  MaxImages: 20,
}

interface JsonBreakpointsUrlResponse {
  readonly breakpoints: readonly number[]
}
