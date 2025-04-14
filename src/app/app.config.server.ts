import { ApplicationConfig, mergeApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
import { appConfig } from './app.config'
import { provideJsonFetcher } from '@/app/common/json/fetcher/json-fetcher'
import { LOCAL_JSON_FETCHER } from '@/app/common/json/fetcher/local-json-fetcher'
import { provideServerRouting } from '@angular/ssr'
import { serverRoutes } from '@/app/app.routes.server'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    provideJsonFetcher(LOCAL_JSON_FETCHER),
  ],
}
export const config = mergeApplicationConfig(appConfig, serverConfig)
