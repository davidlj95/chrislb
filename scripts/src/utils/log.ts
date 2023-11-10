export class Log implements Partial<Console> {
  static info(message: string, ...params: unknown[]) {
    console.info(`ℹ️ ${message}`, ...params)
  }

  static item(message: string, ...params: unknown[]) {
    console.info(`    - ${message}`, ...params)
  }

  static warn(message: string, ...params: unknown[]) {
    console.warn(`⚠️ ${message}`, ...params)
  }

  static group(label: string, ...params: unknown[]) {
    console.group(`🏷️${label}`, ...params)
  }

  static groupEnd() {
    console.groupEnd()
  }

  static ok(message: string, ...params: unknown[]) {
    console.info(`✅  ${message}`, ...params)
  }

  static error(message: string, ...params: unknown[]) {
    console.error(`❌  ${message}`, ...params)
  }
}
