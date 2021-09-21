import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource } from '@discordjs/voice'
import * as discord from './discord'
import * as queueService from './queue'
import * as youtube from './youtube'
import { Log } from './log'

const log = Log('services/player')

let discordPlayer: AudioPlayer
let paused = false
let loop = false
let playing: youtube.IPlayItem | undefined
let currentResource: AudioResource<null>

export function init() {
	if (!discordPlayer) {
		discordPlayer = createAudioPlayer()
	}
	checkQueue()
  return discordPlayer
}

export function getLoop() {
	return loop
}
export function setLoop(value: boolean) {
	loop = value
}

function checkQueue() {
	if (currentResource && currentResource.ended) {
		if (loop) {
			play(playing)
		} else {
			const item = queueService.dequeue()
			if (item) {
				discord.sendMessage(`Playing **${item.title}**`)
				play(item)
			} else {
				discord.setStatus('Waiting for commands...')
				playing = undefined
			}
		}
	}
	setTimeout(checkQueue, 3000)
}

export function play(item?: youtube.IPlayItem) {
	log('play', item)
	paused = false
	try {
		if (item) {
			const stream = youtube.createStream(item.url)
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
