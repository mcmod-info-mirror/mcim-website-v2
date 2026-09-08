import type { Router } from 'vue-router'

// 拦截 mdui 链接元素的普通左键点击，走客户端路由；修饰键与中键保持浏览器默认行为
export function pushOnClick(e: MouseEvent, to: string, router: Router) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  router.push(to)
}
