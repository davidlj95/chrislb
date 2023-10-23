export interface ProjectItem {
  readonly slug: string
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: readonly string[]
  readonly credits: readonly Credit[]
}

export interface Credit {
  readonly role: string
  readonly name: string
  readonly nickname: string
}
