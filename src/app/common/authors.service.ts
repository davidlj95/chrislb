import { Inject, Injectable, InjectionToken } from '@angular/core'
import authors from '@/data/generated/authors.json'
import christianLazaro from '@/data/cms/authors/christian-lazaro.json'

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private _authorBySlug: Map<string, Author>

  constructor(@Inject(AUTHORS_JSON) authorsJson: typeof authors) {
    this._authorBySlug = new Map(
      authorsJson.map((author) => [author.slug, author]),
    )
  }

  bySlug(slug: string): Author | undefined {
    return this._authorBySlug.get(slug)
  }

  get website(): Author {
    return christianLazaro
  }
}

export const AUTHORS_JSON = new InjectionToken<typeof authors>(
  'Authors list JSON',
  {
    factory: () => authors,
  },
)

export interface Author {
  slug?: string
  name: string
  social?: {
    preferred?: string | null
    instagram?: string
    linkedin?: string
    tiktok?: string
  }
}
