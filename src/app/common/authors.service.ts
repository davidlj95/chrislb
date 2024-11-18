import { Inject, Injectable, InjectionToken } from '@angular/core'
import authors from '../../data/authors.json'
import christianLazaro from '../../data/authors/christian-lazaro.json'

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private authorBySlug: Map<string, Author>

  constructor(@Inject(AUTHORS_JSON) authorsJson: typeof authors) {
    this.authorBySlug = new Map(
      authorsJson.map((author) => [author.slug, author]),
    )
  }

  public bySlug(slug: string): Author | undefined {
    return this.authorBySlug.get(slug)
  }

  public get website(): Author {
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
