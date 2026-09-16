import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildCurl, groupName, normalizeReference, sampleBody, schemaType } from '../../server/utils/reference'

const raw = JSON.parse(readFileSync(new URL('../fixtures/api/openapi.json', import.meta.url), 'utf8'))
const doc = normalizeReference(raw, 'https://mod.mcimirror.top')
const operations = doc.groups.flatMap(group => group.operations)
const find = (id: string) => operations.find(operation => operation.id === id)!

describe('groupName', () => {
  it('takes the last segment of a rust module path', () => {
    expect(groupName('crate::routes::common')).toBe('Common')
  })

  it('spells the platform the way the rest of the site does', () => {
    expect(groupName('Curseforge')).toBe('CurseForge')
    expect(groupName('File CDN')).toBe('File CDN')
  })
})

describe('schemaType', () => {
  it('names references and arrays', () => {
    expect(schemaType({ $ref: '#/components/schemas/Version' })).toBe('Version')
    expect(schemaType({ type: 'array', items: { $ref: '#/components/schemas/Project' } })).toBe('Project[]')
  })

  it('reads a keyed object as a map', () => {
    expect(schemaType({ type: 'object', additionalProperties: { $ref: '#/components/schemas/Version' } })).toBe('{string: Version}')
  })

  it('drops the null half of a nullable type', () => {
    expect(schemaType({ type: ['boolean', 'null'] })).toBe('boolean')
  })
})

describe('sampleBody', () => {
  it('prefers the recorded default over a placeholder', () => {
    const schemas = { ModsBody: raw.components.schemas.ModsBody }
    expect(sampleBody({ $ref: '#/components/schemas/ModsBody' }, schemas)).toEqual({ modIds: [238222] })
  })

  it('falls back to a typed placeholder when there is no default', () => {
    const schemas = { CurseForgeTranslationRequest: raw.components.schemas.CurseForgeTranslationRequest }
    expect(sampleBody({ $ref: '#/components/schemas/CurseForgeTranslationRequest' }, schemas)).toEqual({ modids: [0] })
  })

  it('stops at a self reference', () => {
    const schemas = { Loop: { type: 'object', required: ['next'], properties: { next: { $ref: '#/components/schemas/Loop' } } } }
    expect(sampleBody({ $ref: '#/components/schemas/Loop' }, schemas)).toEqual({ next: null })
  })
})

describe('buildCurl', () => {
  const param = (over: Record<string, unknown>) => ({ name: 'x', in: 'query', required: false, type: 'string', description: '', example: null, ...over })

  it('fills path parameters from their example', () => {
    const params = [param({ name: 'mod_id', in: 'path', required: true, example: '238222' })]
    expect(buildCurl('https://a.test', 'GET', '/mods/{mod_id}', params, null)).toBe('curl \'https://a.test/mods/238222\'')
  })

  it('keeps the placeholder when no example is given', () => {
    const params = [param({ name: 'mod_id', in: 'path', required: true })]
    expect(buildCurl('https://a.test', 'GET', '/mods/{mod_id}', params, null)).toBe('curl \'https://a.test/mods/{mod_id}\'')
  })

  it('takes required and exemplified query parameters and encodes them', () => {
    const params = [
      param({ name: 'gameId', required: true }),
      param({ name: 'query', example: 'a b' }),
      param({ name: 'skipped' }),
    ]
    expect(buildCurl('https://a.test', 'GET', '/search', params, null)).toBe('curl \'https://a.test/search?gameId={gameId}&query=a%20b\'')
  })

  it('writes the verb, content type and body for a post', () => {
    expect(buildCurl('https://a.test', 'POST', '/mods', [], { modIds: [1] })).toBe(
      'curl -X POST \'https://a.test/mods\' \\\n  -H \'Content-Type: application/json\' \\\n  -d \'{"modIds":[1]}\'',
    )
  })
})

describe('recorded openapi fixture', () => {
  it('orders the groups with the platforms first', () => {
    expect(doc.groups.map(group => group.name)).toEqual(['CurseForge', 'Modrinth', 'Translate', 'File CDN', 'Common', 'Root'])
    expect(doc.groups[0]!.id).toBe('group-curseforge')
    expect(doc.groups.find(group => group.name === 'File CDN')!.id).toBe('group-file-cdn')
  })

  it('keeps every operation and gives each one a summary and a response', () => {
    expect(operations).toHaveLength(38)
    expect(operations.filter(operation => !operation.summary)).toEqual([])
    expect(operations.filter(operation => !operation.responses.length)).toEqual([])
  })

  it('flattens parameters and responses of a real operation', () => {
    const operation = find('get_file')
    expect(operation.method).toBe('GET')
    expect(operation.params).toEqual([
      { name: 'mod_id', in: 'path', required: true, type: 'integer', description: 'ID of the mod to which the file belongs', example: null },
      { name: 'file_id', in: 'path', required: true, type: 'integer', description: 'ID of the file to retrieve', example: null },
    ])
    expect(operation.responses).toEqual([
      { code: '200', description: 'File found', schema: 'FileResponse' },
      { code: '404', description: 'File not found', schema: null },
      { code: '500', description: 'Internal server error', schema: null },
    ])
  })

  it('marks the deprecated translate endpoints', () => {
    expect(operations.filter(operation => operation.deprecated).map(operation => operation.id))
      .toEqual(['get_curseforge_translation_deprecated', 'get_modrinth_translation_deprecated'])
  })

  it('builds a runnable command for a batch endpoint', () => {
    expect(find('get_version_files').curl).toBe(
      'curl -X POST \'https://mod.mcimirror.top/modrinth/v2/version_files\' \\\n  -H \'Content-Type: application/json\' \\\n  -d \'{"hashes":["d67e66ea4bb2409997b636dae4203d33764cdcc8"],"algorithm":"sha1"}\'',
    )
  })

  it('keeps the raw tag so the swagger deep link still resolves', () => {
    expect(find('get_statistics').tag).toBe('Common')
  })
})
