import { Injectable } from '@angular/core'
import { JsonFetcher } from '@/app/common/json/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'
import { from, Observable } from 'rxjs'
import { ProjectDetail, ProjectListItem } from './project'

@Injectable()
export class ProjectsService {
  constructor(private readonly _jsonFetcher: JsonFetcher) {}

  async getListItems(): Promise<readonly ProjectListItem[]> {
    return this._jsonFetcher.fetch(PROJECTS_DIR)
  }

  getDetail(slug: string): Observable<ProjectDetail> {
    return from(this._jsonFetcher.fetch<ProjectDetail>(PROJECTS_DIR, slug))
  }
}
