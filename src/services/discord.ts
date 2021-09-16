import { Channel, Client } from 'discord.js'

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

  const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL
  } = process.env

  await client.login(DISCORD_TOKEN)
  channel = await client.channels.fetch(DISCORD_CHANNEL)

  return client
}

export function getClient() {
  return client
}

export function getChannel() {
  return channel
}
