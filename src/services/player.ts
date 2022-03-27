import { AudioPlayer, createAudioPlayer } from '@discordjs/voice'
import * as discord from './discord'
import * as queueService from './queue'
import * as browserService from './browser'
import * as metadata from './metadata'
import { Log } from './log'
import { createAudioResourceFromPage } from 'utils/browser'

const log = Log('services/player')

let paused = false
let repeat = false
let related = false
let loading = false
let playing: metadata.IPlayItem | undefined

let discordPlayer: AudioPlayer

let audio: HTMLAudioElement | undefined

export function init() {
	if (!discordPlayer) {
		discordPlayer = createAudioPlayer()
		discord.setStatus('Waiting for commands...')
	}
  return discordPlayer
}

export function setRelated(value: boolean) {
	related = value
}
export function getRelated() {
	return related
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
	log('checkQueue')
	if (!loading) {
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
				discord.sendMessage(`Playing related...`)
			} else {
				pause()
				discord.setStatus('Waiting for commands...')
				playing = undefined
			}
		}
	}
}

export async function play(item?: metadata.IPlayItem) {
	log('play', item)
	paused = false
	loading = true
	if (item) {
		try {
			discordPlayer?.stop(true)
			const page = await browserService.newPage(item.url)
			page.on("framenavigated", () => checkQueue())
			const audioResource = await createAudioResourceFromPage(page)
			discordPlayer.play(audioResource)
			playing = item
			discord.setStatus(item.title, 'PLAYING')
			log('playing', audio)
			loading = false
			return true
		} catch (error) {
			loading = false
			log('error on play', error)
			discord.sendMessage('Error playing!')
			return false
		}
	} else {
		log('unpause')
		audio?.play()
		loading = false
		return true
	}
}

export function pause() {
	paused = true
	audio?.pause()
}

export function isPaused() {
	return paused
}
