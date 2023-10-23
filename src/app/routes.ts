import { IPageSeoData } from '@ngaox/seo'
import meta from '../data/meta.json'

export const PROJECTS_PATH = 'projects'
export const NOT_FOUND_DATA: RouteData = {
  NgaoxSeo: {
    title: getTitle(meta.notFound.title),
    description: meta.notFound.description,
    image: undefined,
  },
}
export const NOT_FOUND_PATH = '404'
type RouteData = { NgaoxSeo?: IPageSeoData }

export function getCanonicalUrlForPath(path: string) {
  return new URL(path, new URL(meta.default.canonicalUrl)).toString()
}

function getTitle(title: string) {
  return `${title} | ${meta.default.siteName}`
}
