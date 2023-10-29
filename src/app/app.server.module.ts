import { NgModule } from '@angular/core'
import { ServerModule } from '@angular/platform-server'

import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { LocalJsonFetcherService } from './common/json-fetcher/local-json-fetcher.service'
import { JsonFetcher } from './common/json-fetcher/json-fetcher-injection-token'

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [{ provide: JsonFetcher, useClass: LocalJsonFetcherService }],
})
export class AppServerModule {}
