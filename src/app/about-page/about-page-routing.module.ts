import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AboutPageComponent } from './about-page.component'
import aboutPageMetadata from '../../data/pages/about.json'
import christianLazaro from '../../data/authors/christian-lazaro.json'
import { addOpenGraphProfileMetadataFromAuthor } from './add-open-graph-profile-metadata-from-author'
import { getMetadataFromJson } from '../common/routing/get-metadata-from-json'

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AboutPageComponent,
        data: {
          NgaoxSeo: {
            ...addOpenGraphProfileMetadataFromAuthor(
              getMetadataFromJson(aboutPageMetadata),
              christianLazaro,
            ),
          },
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
