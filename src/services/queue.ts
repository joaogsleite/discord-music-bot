import { IPlayItem } from 'services/youtube'
import { Log } from 'services/log'

const log = Log('services/queue')

let queue: IPlayItem[] = []
let random: boolean = false

export function enqueue(item: IPlayItem | IPlayItem[]) {
  if (Array.isArray(item)) {
    queue = queue.concat(item)
  } else {
    queue.push(item)
  }
  log('added to queue', item)
}

export function dequeue() {
  const index = random
    ? Math.floor(Math.random() * queue.length)
    : 0
  const item = queue.splice(index, 1)[0]
  if (item) {
    log('removed from queue', item)
    return item
  }
}

export function setRandom(enabled: boolean) {
  random = enabled
}

export function getRandom() {
  return random
}

export function list() {
  return queue
}

export function clear() {
  queue = []
}