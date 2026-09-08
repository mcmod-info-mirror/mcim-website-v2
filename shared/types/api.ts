export interface Statistics {
  curseforge: { mod: number, file: number }
  modrinth: { project: number, version: number, file: number }
  translate: { curseforge: number, modrinth: number }
}

export interface BuildInfo {
  version: string
  commit: string
  branch: string
  build_time: string
}

export interface Sponsor {
  name: string
  amount: number
  date: string
  message: string
}
