export function useRelativeTime() {
  const now = useState<number>('now', () => Date.now())
  onMounted(() => {
    now.value = Date.now()
    const timer = setInterval(() => {
      now.value = Date.now()
    }, 30000)
    onUnmounted(() => clearInterval(timer))
  })
  return now
}
