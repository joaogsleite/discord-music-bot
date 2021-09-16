import { IPlayItem } from 'services/youtube'
import { Log } from 'services/log'

const log = Log('services/queue')

let queue: IPlayItem[] = []

export function enqueue(item: IPlayItem) {
  queue.push(item)
  log('added to queue', item)
}

export function dequeue() {
  const item = queue.shift()
  log('removed from queue', item)
  return item
}

export function list() {
  return queue
}

export function clear() {
  queue = []
}