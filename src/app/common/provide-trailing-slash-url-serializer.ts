import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router'
import { ClassProvider } from '@angular/core'

class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override serialize = (tree: UrlTree) =>
    withTrailingSlash(super.serialize(tree))
}

// Extracted from class to allow builder to rename method to a shorter name
const withTrailingSlash = (url: string): string => {
  const splitOn = url.indexOf('?') > -1 ? '?' : '#'
  const pathArr = url.split(splitOn)

  if (!pathArr[0].endsWith('/')) {
    const fileName = url.substring(url.lastIndexOf('/') + 1)
    if (fileName.indexOf('.') === -1) {
      pathArr[0] += '/'
    }
  }
  return pathArr.join(splitOn)
}

/**
 * Provides trailing slash URL serializer for SSG performance purposes
 *
 * Pre-rendered pages will be outputted to an `index.html` file into a directory containing its name
 * For instance: `/404` route will be pre-rendered into `404/index.html`
 *
 * When serving the pre-rendered site, web servers will redirect then `/404` requests into `/404/` given that
 * file entry is actually a directory. And then the pre-rendered `index.html` will be loaded.
 * That's the case of this site, where the web server is provided by Cloudflare Pages service
 *
 * To avoid that redirection and save that request/response round trip, using a URL serializer that will add a
 * trailing slash to Angular internalRoutes. This way, internalRoutes will end with `/` and the redirection won't be needed
 *
 * This is a workaround as Angular does not yet support doing this
 *
 * Source: https://github.com/angular/angular/issues/16051#issuecomment-575346573
 *
 * Caveat: all non-file URLs will be serialized with trailing slash. So `/users/bob` would be `/users/bob/`
 * A bit weird, as `/users/bob/` has 3 path segments: `users`, `bob` and the empty segment.
 * And that one is usually omitted. But given this is not expected soon and if it was, it's only a matter of adding
 * a trailing slash, not bad anyway.
 *
 * REST does not have an opinion on this topic:
 * https://stackoverflow.com/a/61547216/3263250
 *
 * Though Rails does for instance, and prefers `/users` for the collection and `/users/:id` (`/users/bob`) +
 * for the resource: https://guides.rubyonrails.org/routing.html
 */

export const provideTrailingSlashUrlSerializer: () => ClassProvider = () => ({
  provide: UrlSerializer,
  useClass: TrailingSlashUrlSerializer,
})
