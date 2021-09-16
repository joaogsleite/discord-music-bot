import * as discordVoice from '@discordjs/voice'
import * as youtube from './youtube'
import { StageChannel, VoiceChannel } from 'discord.js'
import { Log } from './log'

const log = Log('services/voice')

let connection: discordVoice.VoiceConnection
let player: discordVoice.AudioPlayer

export function join(channel?: VoiceChannel | StageChannel | null) {
	log('join channel', channel)
	if (!(channel instanceof VoiceChannel)) return
	connection = discordVoice.joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	})
	log('connection', connection)
	player = discordVoice.createAudioPlayer()
	player.on('error', handlePlayerError)
	connection.subscribe(player)
	log('connection susbribed player', player)
}

export function play(url: string) {
	log('play', url)
	const stream = youtube.createStream(url)
	const resource = discordVoice.createAudioResource(stream)
	player.play(resource)
}

function handlePlayerError(error: discordVoice.AudioPlayerError) {
	log('player error', error)
}
