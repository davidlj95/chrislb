import { Injectable } from '@angular/core'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'
import { addJsonExtension, getListFilename } from '../common/files'
import { ProjectListItem } from './project-list-item'
import { from, Observable } from 'rxjs'
import { Project } from './project'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private jsonFetcher: JsonFetcher) {}

  async getListItems(): Promise<ReadonlyArray<ProjectListItem>> {
    const projects = await this.jsonFetcher.fetch<
      ReadonlyArray<ProjectListItem>
    >(getListFilename(PROJECTS_DIR))
    return Array.from(projects).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }

  bySlug(slug: string): Observable<Project> {
    return from(
      this.jsonFetcher.fetch<Project>(PROJECTS_DIR, addJsonExtension(slug)),
    )
  }
}
