import * as discordVoice from '@discordjs/voice'
import * as connection from './connection'
import * as queueService from './queue'
import * as youtube from './youtube'
import { Log } from './log'

const log = Log('services/player')

let discordPlayer: discordVoice.AudioPlayer
let paused = false
let currentResource: discordVoice.AudioResource<null>

export function init() {
	if (!discordPlayer) {
		discordPlayer = discordVoice.createAudioPlayer()
	}
	checkQueue()
  return discordPlayer
}

function checkQueue() {
	if (currentResource && currentResource.ended) {
		const item = queueService.dequeue()
		if (item) {
			connection.sendMessage(`Playing **${item.title}**`)
			play(item)
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
			currentResource = discordVoice.createAudioResource(stream)
			discordPlayer.play(currentResource)
		} else {
			return discordPlayer.unpause()
		}
	} catch (error) {
		log('error playing video', error)
    connection.sendMessage('Error playing the video')
	}
}

export function pause() {
	paused = true
	discordPlayer.pause()
}

export function isPaused() {
	return paused
}
