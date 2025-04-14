import { inject, Injectable } from '@angular/core'
import { JSON_FETCHER } from '@/app/common/json/fetcher/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'
import { Observable } from 'rxjs'
import { ProjectDetail, ProjectListItem } from './project'

@Injectable()
export class ProjectsService {
  private readonly _jsonFetcher = inject(JSON_FETCHER)

  getListItems = (): Observable<readonly ProjectListItem[]> =>
    this._jsonFetcher(PROJECTS_DIR)

  getDetail = (slug: string): Observable<ProjectDetail> =>
    this._jsonFetcher(PROJECTS_DIR, slug)
}
