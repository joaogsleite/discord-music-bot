import { IPlayItem } from 'services/youtube'
import { Log } from 'services/log'

const log = Log('services/queue')

let queue: IPlayItem[] = []

export function enqueue(item: IPlayItem | IPlayItem[]) {
  if (Array.isArray(item)) {
    queue = queue.concat(item)
  } else {
    queue.push(item)
  }
  log('added to queue', item)
}

export function dequeue() {
  const item = queue.shift()
  if (item) {
    log('removed from queue', item)
    return item
  }
}

export function list() {
  return queue
}

export function clear() {
  queue = []
}