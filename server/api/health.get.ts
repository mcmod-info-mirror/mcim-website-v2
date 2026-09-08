export default defineEventHandler(() => ({ status: 'ok', uptime: Math.round(process.uptime()) }))
