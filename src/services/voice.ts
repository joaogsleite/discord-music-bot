import * as discordVoice from '@discordjs/voice'
import * as youtube from './youtube'
import { StageChannel, VoiceChannel } from 'discord.js'

let connection: discordVoice.VoiceConnection
let player = discordVoice.createAudioPlayer()

export function join(channel?: VoiceChannel | StageChannel | null) {
	if (!(channel instanceof VoiceChannel)) return
	connection = discordVoice.joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	})
	connection.subscribe(player)
}

export function play(url: string) {
	const stream = youtube.createStream(url)
	const resource = discordVoice.createAudioResource(stream)
	player.play(resource)
}
