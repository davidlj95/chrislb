import { cwd } from 'process'

//👇 __dirname no longer exists when using ESBuild
//   import.meta.url returns an invalid path created by Angular CLI
//   https://github.com/angular/angular-cli/blob/18.0.5/packages/angular/build/src/utils/server-rendering/esm-in-memory-loader/loader-hooks.ts#L40-L44
export const REPO_ROOT_DIRECTORY = cwd()
