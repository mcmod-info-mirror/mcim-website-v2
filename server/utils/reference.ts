import type { ReferenceDoc, ReferenceGroup, ReferenceOperation, ReferenceParam, ReferenceResponse } from '~~/shared/types/reference'

type Json = Record<string, unknown>

const METHODS = ['get', 'post', 'put', 'patch', 'delete']

/// 平台在前、周边在后，未知 tag 按字母序接在末尾
const GROUP_ORDER = ['CurseForge', 'Modrinth', 'Translate', 'File CDN', 'Common', 'Root']

const MAX_DEPTH = 3

function asObject(value: unknown): Json {
  return typeof value === 'object' && value !== null ? value as Json : {}
}

function refName(schema: Json): string {
  const ref = schema.$ref
  return typeof ref === 'string' ? ref.split('/').pop() ?? '' : ''
}

/// 只取一个人读得懂的类型串：引用取 schema 名，数组写成 X[]，键值表写成 {string: X}
export function schemaType(schema: Json): string {
  const ref = refName(schema)
  if (ref) return ref
  const type = Array.isArray(schema.type) ? schema.type.find(t => t !== 'null') : schema.type
  if (type === 'array') return `${schemaType(asObject(schema.items)) || 'object'}[]`
  if (schema.additionalProperties) return `{string: ${schemaType(asObject(schema.additionalProperties))}}`
  return typeof type === 'string' ? type : 'object'
}

/// utoipa 把 schema 的 default 写成了字符串，数组和对象要再解一层才是真值
function defaultValue(schema: Json, type: unknown): unknown {
  const raw = schema.default
  if (raw === undefined) return undefined
  if (type === 'array' || type === 'object') {
    if (typeof raw !== 'string') return raw
    try {
      return JSON.parse(raw)
    }
    catch {
      return raw
    }
  }
  if (type === 'integer' || type === 'number') return Number(raw)
  if (type === 'boolean') return raw === true || raw === 'true'
  return raw
}

/// 按 schema 造一个最小的请求体样例，有 default 就用它，这样 curl 大多能直接跑
export function sampleBody(schema: Json, schemas: Json, depth = 0, seen: string[] = []): unknown {
  const ref = refName(schema)
  if (ref) {
    if (seen.includes(ref) || depth > MAX_DEPTH) return null
    return sampleBody(asObject(schemas[ref]), schemas, depth, [...seen, ref])
  }
  const type = Array.isArray(schema.type) ? schema.type.find(t => t !== 'null') : schema.type
  const fallback = defaultValue(schema, type)
  if (fallback !== undefined) return fallback
  if (depth > MAX_DEPTH) return null
  if (type === 'array') return [sampleBody(asObject(schema.items), schemas, depth + 1, seen)]
  if (type === 'object' || schema.properties) {
    const props = asObject(schema.properties)
    const keys = Array.isArray(schema.required) ? schema.required as string[] : Object.keys(props)
    const body: Json = {}
    for (const key of keys) {
      if (props[key]) body[key] = sampleBody(asObject(props[key]), schemas, depth + 1, seen)
    }
    return body
  }
  if (type === 'integer' || type === 'number') return 0
  if (type === 'boolean') return false
  return 'string'
}

function quote(value: string): string {
  return `'${value.replaceAll('\'', '\'\\\'\'')}'`
}

/// 没有示例值的参数保留 {name} 原样：花括号在 shell 里是字面量，也是 OpenAPI 自己的写法
export function buildCurl(base: string, method: string, path: string, params: ReferenceParam[], body: unknown): string {
  let target = path
  for (const param of params.filter(p => p.in === 'path')) {
    target = target.replace(`{${param.name}}`, param.example ?? `{${param.name}}`)
  }
  const query = params
    .filter(p => p.in === 'query' && (p.required || p.example !== null))
    .map(p => `${p.name}=${p.example === null ? `{${p.name}}` : encodeURIComponent(p.example)}`)
  const url = `${base}${target}${query.length ? `?${query.join('&')}` : ''}`
  const lines = [`curl${method === 'GET' ? '' : ` -X ${method}`} ${quote(url)}`]
  if (body !== null) {
    lines.push('-H \'Content-Type: application/json\'')
    lines.push(`-d ${quote(JSON.stringify(body))}`)
  }
  return lines.join(' \\\n  ')
}

/// /healthz 的 tag 被 utoipa 写成了 crate::routes::common，取最后一段归位
export function groupName(tag: string): string {
  const last = tag.split('::').pop() || tag
  const name = last.charAt(0).toUpperCase() + last.slice(1)
  return name === 'Curseforge' ? 'CurseForge' : name
}

function toParam(raw: unknown): ReferenceParam {
  const param = asObject(raw)
  return {
    name: String(param.name ?? ''),
    in: String(param.in ?? 'query'),
    required: param.required === true,
    type: schemaType(asObject(param.schema)),
    description: String(param.description ?? ''),
    example: param.example == null ? null : String(param.example),
  }
}

function jsonSchema(raw: unknown): Json | null {
  const schema = asObject(asObject(asObject(raw).content)['application/json']).schema
  return schema === undefined ? null : asObject(schema)
}

function toResponses(raw: unknown): ReferenceResponse[] {
  return Object.entries(asObject(raw))
    .map(([code, value]) => {
      const schema = jsonSchema(value)
      return { code, description: String(asObject(value).description ?? ''), schema: schema && schemaType(schema) }
    })
    .sort((a, b) => a.code.localeCompare(b.code))
}

export function normalizeReference(raw: unknown, baseUrl: string): ReferenceDoc {
  const doc = asObject(raw)
  const info = asObject(doc.info)
  const schemas = asObject(asObject(doc.components).schemas)
  const grouped = new Map<string, ReferenceOperation[]>()

  for (const [path, item] of Object.entries(asObject(doc.paths))) {
    for (const [method, value] of Object.entries(asObject(item))) {
      if (!METHODS.includes(method)) continue
      const op = asObject(value)
      const tag = String((op.tags as unknown[] | undefined)?.[0] ?? 'Common')
      const params = (Array.isArray(op.parameters) ? op.parameters : []).map(toParam)
      const bodySchema = jsonSchema(op.requestBody)
      const verb = method.toUpperCase()
      const name = groupName(tag)
      const list = grouped.get(name) ?? []
      list.push({
        id: String(op.operationId || `${method}-${path}`),
        method: verb,
        path,
        summary: String(op.description ?? op.summary ?? ''),
        deprecated: op.deprecated === true,
        tag,
        params,
        body: bodySchema && schemaType(bodySchema),
        responses: toResponses(op.responses),
        curl: buildCurl(baseUrl, verb, path, params, bodySchema ? sampleBody(bodySchema, schemas) : null),
      })
      grouped.set(name, list)
    }
  }

  const rank = (name: string) => {
    const index = GROUP_ORDER.indexOf(name)
    return index === -1 ? GROUP_ORDER.length : index
  }
  const groups: ReferenceGroup[] = [...grouped]
    .map(([name, operations]) => ({ id: `group-${name.toLowerCase().replaceAll(' ', '-')}`, name, operations }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))

  return {
    generated_at: new Date().toISOString(),
    title: String(info.title ?? 'API'),
    version: String(info.version ?? ''),
    base_url: baseUrl,
    groups,
  }
}
