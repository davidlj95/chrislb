import { ApplicationConfig, mergeApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
import { appConfig } from './app.config'
import { JsonFetcher } from '@/app/common/json/json-fetcher'
import { LocalJsonFetcherService } from '@/app/common/json/local-json-fetcher.service'
import { provideServerRouting } from '@angular/ssr'
import { serverRoutes } from '@/app/app.routes.server'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    { provide: JsonFetcher, useClass: LocalJsonFetcherService },
  ],
}
export const config = mergeApplicationConfig(appConfig, serverConfig)
