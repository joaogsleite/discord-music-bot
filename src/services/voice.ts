import { VoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import * as playerService from './player'
import { StageChannel, VoiceChannel } from 'discord.js'
import { Log } from './log'

const log = Log('services/voice')

let connection: VoiceConnection
let voiceChannelId: string

export function join(channel: VoiceChannel | StageChannel | null) {
	log('join channel', channel?.name)
	if (!(channel instanceof VoiceChannel)) return
	connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator as any,
	})
	voiceChannelId = channel.id
	log('connection', connection?.joinConfig)
	const player = playerService.init()
	connection.subscribe(player)
	log('subscribed player', player.constructor.name)
}

export function getVoiceChannelId() {
	return voiceChannelId
}