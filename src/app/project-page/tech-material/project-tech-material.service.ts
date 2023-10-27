import { Inject, Injectable, InjectionToken } from '@angular/core'
import projectsTechMaterials from '../../../data/images/projects-tech-materials.json'
import { Observable, of } from 'rxjs'
import { ImageAsset, ImageAssetsBySlug } from '../../../data/images/types'

@Injectable({
  providedIn: 'root',
})
export class ProjectTechMaterialService {
  constructor(
    @Inject(TECH_MATERIALS_BY_SLUG)
    private techMaterialsBySlug: ImageAssetsBySlug,
  ) {}

  bySlug(projectSlug: string): Observable<ReadonlyArray<ImageAsset>> {
    return of(this.techMaterialsBySlug[projectSlug] ?? [])
  }
}

const TECH_MATERIALS_BY_SLUG = new InjectionToken<ImageAssetsBySlug>(
  'Tech materials by project slug',
  {
    factory: () => projectsTechMaterials,
  },
)
