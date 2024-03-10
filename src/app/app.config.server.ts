import { ApplicationConfig, mergeApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
import { appConfig } from './app.config'
import { JsonFetcher } from './common/json-fetcher/json-fetcher'
import { LocalJsonFetcherService } from './common/json-fetcher/local-json-fetcher.service'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: JsonFetcher, useClass: LocalJsonFetcherService },
  ],
}
export const config = mergeApplicationConfig(appConfig, serverConfig)
