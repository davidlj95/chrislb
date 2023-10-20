// Constants for mocking platform in tests
// https://github.com/angular/angular/blob/16.2.6/packages/common/src/platform_id.ts#L9-L12
export const PLATFORM_BROWSER_ID = 'browser'
export const PLATFORM_SERVER_ID = 'server'
export const PLATFORM_WORKER_APP_ID = 'browserWorkerApp'
export const PLATFORM_WORKER_UI_ID = 'browserWorkerUi'

export type PlatformId =
  | typeof PLATFORM_BROWSER_ID
  | typeof PLATFORM_SERVER_ID
  | typeof PLATFORM_WORKER_APP_ID
  | typeof PLATFORM_WORKER_UI_ID
