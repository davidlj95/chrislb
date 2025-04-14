import { inject, Injectable } from '@angular/core'
import { JSON_FETCHER } from '@/app/common/json/fetcher/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'
import { from, Observable } from 'rxjs'
import { ProjectDetail, ProjectListItem } from './project'

@Injectable()
export class ProjectsService {
  private readonly _jsonFetcher = inject(JSON_FETCHER)

  async getListItems(): Promise<readonly ProjectListItem[]> {
    return this._jsonFetcher(PROJECTS_DIR)
  }

  getDetail(slug: string): Observable<ProjectDetail> {
    return from(this._jsonFetcher<ProjectDetail>(PROJECTS_DIR, slug))
  }
}
