import { Provider } from '@angular/core'
import { MockProvider } from 'ng-mocks'
import { IMAGE_LOADER, PRECONNECT_CHECK_BLOCKLIST } from '@angular/common'

export function getDummyOptimizedImageProviders(): Provider[] {
  return [
    MockProvider(IMAGE_LOADER, () => 'https://example.com/image.jpg'),
    MockProvider(PRECONNECT_CHECK_BLOCKLIST, 'https://example.com', 'useValue'),
  ]
}
