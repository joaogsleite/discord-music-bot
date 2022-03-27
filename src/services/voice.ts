import { VoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioResource, AudioPlayer } from '@discordjs/voice'
import { StageChannel, VoiceChannel } from 'discord.js'
import { Log } from './log'
import * as playerService from './player'
import { Readable } from 'stream'

const log = Log('services/voice')

let connection: VoiceConnection
let voiceChannelId: string

export async function join(channel: VoiceChannel | StageChannel | null) {
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

export async function setStream(stream: Readable) {

}

export function getVoiceChannelId() {
	return voiceChannelId
}