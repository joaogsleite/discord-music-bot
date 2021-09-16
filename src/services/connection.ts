import * as discordVoice from '@discordjs/voice'
import * as playerService from './player'
import { StageChannel, TextBasedChannels, VoiceChannel } from 'discord.js'
import { Log } from './log'

const log = Log('services/voice')

let connection: discordVoice.VoiceConnection
let currentTextChannel: TextBasedChannels

export function join(channel: VoiceChannel | StageChannel | null, textChannel: TextBasedChannels) {
	log('join channel', channel)
	if (!(channel instanceof VoiceChannel)) return
	connection = discordVoice.joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	})
	currentTextChannel = textChannel
	log('connection', connection)
	const player = playerService.init()
	connection.subscribe(player)
	log('connection susbribed player', player)
}

export function sendMessage(message: string) {
	currentTextChannel.send(message)
}