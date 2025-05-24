export function debounce(func: (...args: any[]) => void, delay=500) {
  let timer: ReturnType<typeof setTimeout>;
  return function(...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args)
    }, delay);
  }
}
