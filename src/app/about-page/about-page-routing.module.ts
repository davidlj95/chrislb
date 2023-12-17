import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AboutPageComponent } from './about-page.component'
import { makeRouteMetadata } from '../common/routing/make-route-metadata'
import aboutPageMetadata from '../../data/pages/about.json'
import aboutPageContents from '../../data/misc/about.json'
import { ABOUT_PATH } from '../common/routing/paths'
import { OpenGraphType } from '@davidlj95/ngx-meta/open-graph'

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AboutPageComponent,
        data: makeRouteMetadata(
          {
            ...aboutPageMetadata,
            openGraphType: OpenGraphType.Profile,
            openGraphProfile: aboutPageContents.openGraphProfile,
          },
          [ABOUT_PATH],
        ),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
