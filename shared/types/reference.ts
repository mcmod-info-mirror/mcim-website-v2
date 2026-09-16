export interface ReferenceParam {
  name: string
  in: string
  required: boolean
  type: string
  description: string
  example: string | null
}

export interface ReferenceResponse {
  code: string
  description: string
  schema: string | null
}

export interface ReferenceOperation {
  id: string
  method: string
  path: string
  summary: string
  deprecated: boolean
  tag: string
  params: ReferenceParam[]
  body: string | null
  responses: ReferenceResponse[]
  curl: string
}

export interface ReferenceGroup {
  id: string
  name: string
  operations: ReferenceOperation[]
}

export interface ReferenceDoc {
  generated_at: string
  title: string
  version: string
  base_url: string
  groups: ReferenceGroup[]
}
