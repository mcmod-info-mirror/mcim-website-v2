// mdui 的单选分段按钮再点已选中项会取消选中；在宿主上拦截这次点击，不让分组收到
export function keepSelected(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement & { selected?: boolean }
  if (el.selected) {
    e.stopPropagation()
    e.preventDefault()
  }
}
