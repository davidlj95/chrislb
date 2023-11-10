import { ResolveFn } from '@angular/router'

export type RouteDataResolver<T> = { [k in keyof T]: ResolveFn<T[k]> }
