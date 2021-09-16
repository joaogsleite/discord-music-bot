import { Channel, Client } from 'discord.js'
import { Log } from './log'

const log = Log('services/discord')

let channel: Channel | null
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

  const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL
  } = process.env
  log('env', { DISCORD_TOKEN, DISCORD_CHANNEL })

  await client.login(DISCORD_TOKEN)
  channel = await client.channels.fetch(DISCORD_CHANNEL)
  log('login complete')

  return client
}

export function getClient() {
  return client
}

export function getChannel() {
  return channel
}
