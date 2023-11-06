import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AboutPageComponent } from './about-page.component'
import aboutPageMetadata from '../../data/pages/about.json'
import aboutPageContent from '../../data/misc/about.json'
import { getMetadataFromJson } from '../common/routing/get-metadata-from-json'
import { addOpenGraphProfileMetadata } from './add-open-graph-profile-metadata-from-author'

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AboutPageComponent,
        data: {
          NgaoxSeo: {
            ...addOpenGraphProfileMetadata(
              getMetadataFromJson(aboutPageMetadata),
              aboutPageContent.openGraphProfile,
            ),
          },
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
