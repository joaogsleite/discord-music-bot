import fs from 'fs/promises'
import * as discord from './discord'
import * as player from './player'
import * as voiceService from './voice'
import * as queueService from './queue'
import { VoiceChannel } from 'discord.js'
import { Log } from './log'
import { IPlayItem } from './youtube'

const log = Log('services/state')

const FILE_PATH = __dirname + '/../../state.json'
const SAVE_INTERVAL = 10_000

export interface IState {
  voiceChannelId?: string
  playlist?: IPlayItem[]
  loop?: boolean
  random?: boolean
}

export async function restore() {
  log('starting restore')
  try {
    const state = JSON.parse(await fs.readFile(FILE_PATH, 'utf-8')) as IState
    log('state', state)
    const textChannel = discord.getTextChannel()
    if (!state.voiceChannelId)
      throw new Error('No valid text channel')
    log('textChannel', textChannel)
    const voiceChannel = await discord.getVoiceChannel(state.voiceChannelId)
    if (!(voiceChannel instanceof VoiceChannel))
      throw new Error('No valid voice channel')
    log('joining voice channel', voiceChannel.name)
    voiceService.join(voiceChannel)

    queueService.enqueue(state.playlist || [])
    queueService.setRandom(state.random || false)
    queueService.setLoop(state.loop || false)
    log('restored queueService state')

    const item = queueService.dequeue()
    if (item) {
      player.play(item)
      textChannel?.send(`Playing **${item.title}**`)
    }
    log('state restored')
  } catch (error) {
    log('restoreState error', error)
  }
  setInterval(save, SAVE_INTERVAL) 
}

async function save() {
  try {
    log('starting save')
    const state = {
      voiceChannelId: voiceService.getVoiceChannelId(),
      playlist: queueService.list(),
      random: queueService.getRandom(),
      loop: queueService.getLoop()
    }
    log('writeFile', state)
    await fs.writeFile(FILE_PATH, JSON.stringify(state, null, 2), 'utf-8')
    log('end save')
  } catch (error) {
    log('save error', error)
  }
}
