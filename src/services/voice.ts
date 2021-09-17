import { VoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import * as playerService from './player'
import { StageChannel, VoiceChannel } from 'discord.js'
import { Log } from './log'

const log = Log('services/voice')

let connection: VoiceConnection

export function join(channel: VoiceChannel | StageChannel | null) {
	log('join channel', channel)
	if (!(channel instanceof VoiceChannel)) return
	connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	})
	log('connection', connection)
	const player = playerService.init()
	connection.subscribe(player)
	log('connection susbribed player', player)
}
