
export function Log(path: string) {
  return function log(message: string, payload?: any) {
    if (payload) {
      console.log(`${path}:`, message, payload)
    } else {
      console.log(`${path}:`, message)
    }
  }
}
