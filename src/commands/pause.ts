import * as player from 'services/player'
import { Log } from 'services/log'

const log = Log('commands/pause')

export async function handler() {
  log('pause')
  player.pause()
}