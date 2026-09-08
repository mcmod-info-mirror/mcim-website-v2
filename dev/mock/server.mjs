import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const port = Number(process.env.MOCK_PORT ?? 9901)
const scenario = process.env.MOCK_SCENARIO ?? 'normal'
const dir = new URL('../../tests/fixtures/sync/', import.meta.url)
const tasks = JSON.parse(readFileSync(new URL('tasks.json', dir), 'utf8'))
const runs = JSON.parse(readFileSync(new URL('task-runs.json', dir), 'utf8'))

// 把录制时间整体平移到现在，最新一条落在 5 分钟前
const newest = Math.max(...runs.data.map(r => Number(r.started_at.$date.$numberLong)))
const shift = Date.now() - 5 * 60000 - newest
const shifted = runs.data.map(r => ({
  ...r,
  started_at: { $date: { $numberLong: String(Number(r.started_at.$date.$numberLong) + shift) } },
  finished_at: r.finished_at ? { $date: { $numberLong: String(Number(r.finished_at.$date.$numberLong) + shift) } } : null,
  ...(scenario === 'failures' && r.task === 'curseforge-refresh' ? { status: 'error', error: 'connect ETIMEDOUT api.curseforge.com:443', failed: r.total } : {}),
}))

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' })
  res.end(JSON.stringify(body))
}

createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`)
  if (scenario === 'down') return json(res, 503, { error: 'mock is down' })
  if (url.pathname === '/healthz') return json(res, 200, { status: 'ok' })
  if (url.pathname === '/api/tasks') {
    const now = Date.now()
    return json(res, 200, { data: tasks.data.map((t, i) => ({ ...t, next_run_at: new Date(now + (i + 1) * 17 * 60000).toISOString() })) })
  }
  if (url.pathname === '/api/task-runs') {
    const task = url.searchParams.get('task')
    const status = url.searchParams.get('status')
    const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit')) || 100))
    const data = shifted.filter(r => (!task || r.task === task) && (!status || r.status === status)).slice(0, limit)
    return json(res, 200, { data, count: data.length })
  }
  json(res, 404, { error: 'not found' })
}).listen(port, '0.0.0.0', () => console.log(`mock sync api on :${port} scenario=${scenario}`))
