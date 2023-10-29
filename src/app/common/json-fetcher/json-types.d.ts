export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JsonArray
  extends Array<string | number | boolean | Date | Json | JsonArray> {}
