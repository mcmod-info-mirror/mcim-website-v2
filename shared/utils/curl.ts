import type { ReferenceParam } from '~~/shared/types/reference'

function quote(value: string): string {
  return `'${value.replaceAll('\'', '\'\\\'\'')}'`
}

/// 没有值的参数保留 {name} 原样：花括号在 shell 里是字面量，也是 OpenAPI 自己的写法。
/// 值取自 param.example，页面把用户填的内容替换进去再调一次，命令就跟着变。
export function buildCurl(base: string, method: string, path: string, params: ReferenceParam[], body: string | null): string {
  let target = path
  for (const param of params.filter(p => p.in === 'path')) {
    target = target.replace(`{${param.name}}`, param.example ?? `{${param.name}}`)
  }
  const query = params
    .filter(p => p.in === 'query' && (p.required || p.example !== null))
    .map(p => `${p.name}=${p.example === null ? `{${p.name}}` : encodeURIComponent(p.example)}`)
  const url = `${base}${target}${query.length ? `?${query.join('&')}` : ''}`
  const lines = [`curl${method === 'GET' ? '' : ` -X ${method}`} ${quote(url)}`]
  if (body) {
    lines.push('-H \'Content-Type: application/json\'')
    lines.push(`-d ${quote(body)}`)
  }
  return lines.join(' \\\n  ')
}
