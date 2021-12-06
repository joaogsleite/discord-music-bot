import { TextChannel } from 'discord.js'
import * as discord from 'services/discord'

export async function handler() {
  const guild = discord.getGuild()
  const channels = await (await guild.channels.fetch()).values()
  for (const channel of channels) {
    const fetched = await channel.fetch(true)
    if (fetched.isText()) {
      const archived = { fetchAll: true, limit: 100 }
      const threads = await (fetched as TextChannel).threads.fetch({ archived })
      await Promise.all(threads.threads.map(async (thread) => {
        if (!thread.name.includes('archived') && !thread.name.includes('Archived')) {
          await thread.setArchived(false)
        }
      }))
    }
  }
  setTimeout(handler, 3600)
}