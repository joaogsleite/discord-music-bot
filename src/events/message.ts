import * as discord from '../services/discord'
import * as voiceService from '../services/voice'
import * as youtube from '../services/youtube'
import { getMemberVoiceChannel } from '../utils/discord'

const client = discord.getClient()

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (message.content.startsWith('!play')) {

    message.channel.sendTyping()
    
    const voiceChannel = getMemberVoiceChannel(message.member)
    if (!voiceChannel) {
      message.reply('Please join a voice channel')
      return
    }

    try {
      voiceService.join(voiceChannel)
    } catch (error) {
      console.error(error)
      message.reply('Error joining the voice channel')
      return
    }
    
    let query
    try {
      query = message.content.split('!play ')[1]
      if (!query) {
        throw 'no query provided'
      }
    } catch {
      message.reply('Usage: !play youtube link or search query')
      return
    }
    
    const videoInfo = await youtube.query(query)
    if (!videoInfo) {
      message.reply('Youtube video not found')
      return
    }

    try {
      voiceService.play(videoInfo.url)
    } catch (error) {
      console.error(error)
      message.reply('Error playing the video')
      return
    }

    message.reply(`Playing ${videoInfo.title}`)
  }
})
