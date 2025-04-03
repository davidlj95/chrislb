import { ImageCdnApi, UNPUBLISHED_TAG } from '../image-cdn-api'
import { ConfigOptions, v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { Log } from '../../../utils/log'
import { CLOUD_NAME } from '@/app/common/images/cdn/cloudinary'
import { Image } from '@/app/common/images/image'

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

  async getAllImagesInPath(path: string): Promise<readonly Image[]> {
    const response = await cloudinary.api.resources_by_asset_folder(path, {
      max_results: 50, // the default right now, but to be specific & consistent over time
      resource_type: 'image',
      fields: 'width,height,tags', // public_id and asset_id are always included
      tags: true,
    })
    const images = response.resources
      .filter((resource) => !resource.tags.includes(UNPUBLISHED_TAG))
      .toSorted((a, b) => (a.public_id < b.public_id ? -1 : 1))
      .map(({ public_id, width, height }) => ({
        src: public_id,
        width,
        height,
        //version,
        //asset_id,
      }))
    Log.info('Found %d images in path "%s"', images.length, path)
    return images
  }
}

//type Unpacked<T> = T extends (infer U)[] ? U : T
//type ResourceApiResponseItem = Unpacked<ResourceApiResponse['resources']>
//type CloudinaryImageAsset = ImageAsset
//& Pick<ResourceApiResponseItem, 'version'> & {
// TODO: could be included, as it's in the actual response, but not in the response type
//asset_id: string
//}
