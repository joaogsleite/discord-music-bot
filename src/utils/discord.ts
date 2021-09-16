import { GuildMember, VoiceChannel } from "discord.js"

export function getMemberVoiceChannel(member: GuildMember | null) {
  return member?.voice?.channel as VoiceChannel | undefined | null
}