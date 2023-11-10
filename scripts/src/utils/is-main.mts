import * as url from 'url'

/**
 * isMain(import.meta.url)
 * https://2ality.com/2022/07/nodejs-esm-main.html
 */
export function isMain(importMetaUrl: string) {
  const modulePath = url.fileURLToPath(importMetaUrl)
  return process.argv[1] === modulePath
}
