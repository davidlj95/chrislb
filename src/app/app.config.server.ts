import { provideServerRendering, withRoutes } from '@angular/ssr'
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core'
import { appConfig } from './app.config'
import { provideJsonFetcher } from '@/app/common/json/fetcher/json-fetcher'
import { LOCAL_JSON_FETCHER } from '@/app/common/json/fetcher/local-json-fetcher'
import { serverRoutes } from '@/app/app.routes.server'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideJsonFetcher(LOCAL_JSON_FETCHER),
  ],
}
export const config = mergeApplicationConfig(appConfig, serverConfig)
