export interface ProjectItem {
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: readonly string[]
  readonly credits: readonly Credit[]
  readonly images: readonly string[]
}

export interface Credit {
  readonly role: string
  readonly name: string
  readonly nickname: string
}
