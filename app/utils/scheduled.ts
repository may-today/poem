export const debounce = (func: (...args: any[]) => any, wait: number) => {
  let timeout: NodeJS.Timeout | undefined
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}
