import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource } from '@discordjs/voice'
import * as discord from './discord'
import * as queueService from './queue'
import * as metadata from './metadata'
import { createStream } from './stream'
import { Log } from './log'

const log = Log('services/player')

let discordPlayer: AudioPlayer
let paused = false
let repeat = false
let related = false
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
	if (currentResource && currentResource.ended) {
		if (repeat) {
			await play(playing)
		} else {
			const item = queueService.dequeue()
			if (item) {
				discord.sendMessage(`Playing **${item.title}**`)
				await play(item)
			} else if (playing && related) {
					const relatedItems = await metadata.related(playing)
					const next = relatedItems[0]
					if (next) {
						discord.sendMessage(`Playing **${next.title}**`)
						await play(next)
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
	try {
		if (item) {
			const stream = await createStream(item.url)
			currentResource = createAudioResource(stream)
			discordPlayer.play(currentResource)
			playing = item
			discord.setStatus(item.title, 'PLAYING')
			log('playing')
		} else {
			log('unpause')
			return discordPlayer.unpause()
		}
	} catch (error) {
		log('error playing video', error)
    discord.sendMessage('Error playing the video')
	}
}

export function pause() {
	paused = true
	discordPlayer.pause()
}

export function isPaused() {
	return paused
}
