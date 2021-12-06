import { ActivityType, Client, Guild, TextBasedChannels } from 'discord.js'
import { Log } from './log'

const log = Log('services/discord')

let channel: TextBasedChannels | null
let guild: Guild
let client: Client

export async function init() {
  client = new Client({
    intents: [
      'GUILDS',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_VOICE_STATES',
    ]
  })
  log('client created', client)

  const { DISCORD_TOKEN, DISCORD_CHANNEL, DISCORD_GUILD } = process.env
  log('env', { DISCORD_TOKEN, DISCORD_CHANNEL })

  await client.login(DISCORD_TOKEN)
  let fetchedChannel = await client.channels.fetch(DISCORD_CHANNEL)
  if (fetchedChannel?.isText()) {
    channel = fetchedChannel
  }

  const oauth2guilds = await (await client.guilds.fetch()).values()
  for (const oauth2guild of oauth2guilds) {
    if (oauth2guild.id === DISCORD_GUILD) {
      guild = await oauth2guild.fetch()
    }
  }
  log('login complete')

  return client
}

export function sendMessage(msg: string) {
  channel?.send(msg)
}

export function setStatus(status = '', type: ActivityType = 'CUSTOM') {
  client?.user?.setActivity(status, { type: type as any })
}

export function getClient() {
  return client
}

export function getChannel() {
  return channel
}

export function getGuild() {
  return guild
}
