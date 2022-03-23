import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource } from '@discordjs/voice'
import * as discord from './discord'
import * as queueService from './queue'
import * as metadata from './metadata'
import { createStream } from './stream'
import { Log } from './log'
import { sleep } from 'utils/sleep'

const log = Log('services/player')

let discordPlayer: AudioPlayer
let paused = false
let repeat = false
let related = false
let loading = false
let playing: metadata.IPlayItem | undefined
let currentResource: AudioResource<null>

export function init() {
	if (!discordPlayer) {
		discordPlayer = createAudioPlayer()
		discord.setStatus('Waiting for commands...')
	}
	checkQueue()
  return discordPlayer
}

export function getRelated() {
	return related
}
export function setRelated(value: boolean) {
	related = value
}

export function getRepeat() {
	return repeat
}
export function setRepeat(value: boolean) {
	repeat = value
}
export function getPlaying() {
	return playing
}

async function checkQueue() {
	if (!loading && currentResource && currentResource.ended) {
		if (repeat) {
			await play(playing)
		} else {
			const item = queueService.dequeue()
			if (item) {
				const playing = await play(item)
				if (playing) {
					discord.sendMessage(`Playing **${item.title}**`)
				}
			} else if (playing && related) {
					const relatedItems = await metadata.related(playing)
					const next = relatedItems[0]
					if (next) {
						const playing = await play(next)
						if (playing) {
							discord.sendMessage(`Playing **${next.title}**`)
						}
					}
			} else {
				discord.setStatus('Waiting for commands...')
				playing = undefined
			}
		}
	}
	setTimeout(checkQueue, 3000)
}

export async function play(item?: metadata.IPlayItem) {
	log('play', item)
	paused = false
	loading = true
	try {
		if (item) {
			const stream = await createStream(item.url)
			currentResource = createAudioResource(stream)
			discordPlayer.play(currentResource)
			playing = item
			discord.setStatus(item.title, 'PLAYING')
			await sleep(1000)
			log('playing')
			loading = false
			return true
		} else {
			log('unpause')
			loading = false
			return discordPlayer.unpause()
		}
	} catch (error) {
		log('error playing video', error)
    discord.sendMessage('Error playing the video')
		loading = false
		return false
	}
}

export function pause() {
	paused = true
	discordPlayer.pause()
}

export function isPaused() {
	return paused
}
