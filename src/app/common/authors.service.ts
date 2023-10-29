import { Inject, Injectable, InjectionToken } from '@angular/core'
import authors from '../../data/authors.json'

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private authorBySlug: Map<string, Author>

  constructor(@Inject(AUTHORS_JSON) authorsJson: Authors) {
    this.authorBySlug = new Map(
      authorsJson.map((author) => [author.slug, author]),
    )
  }

  public bySlug(slug: string): Author | undefined {
    return this.authorBySlug.get(slug)
  }
}

export const AUTHORS_JSON = new InjectionToken('Authors list JSON', {
  factory: () => authors,
})
export type Authors = typeof authors
export type Author = Authors[number]
