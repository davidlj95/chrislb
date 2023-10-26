import { Inject, Injectable, InjectionToken } from '@angular/core'
import projectsTechMaterials from '../../../data/images/projects-tech-materials.json'
import { Observable, of } from 'rxjs'
import { ImageAsset, TechMaterialsBySlug } from '../../../data/images/types'

@Injectable({
  providedIn: 'root',
})
export class ProjectTechMaterialService {
  constructor(
    @Inject(TECH_MATERIALS_BY_SLUG)
    private techMaterialsBySlug: TechMaterialsBySlug,
  ) {}

  bySlug(projectSlug: string): Observable<ReadonlyArray<ImageAsset>> {
    return of(this.techMaterialsBySlug[projectSlug] ?? [])
  }
}

const TECH_MATERIALS_BY_SLUG = new InjectionToken<TechMaterialsBySlug>(
  'Tech materials by project slug',
  {
    factory: () => projectsTechMaterials,
  },
)
