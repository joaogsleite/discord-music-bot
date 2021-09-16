import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/help')

export async function handler(message: Message) {
  message.reply(`**Available commands:**

*!play youtube link or search query*
Immediately play youtube video

*!pause*
Pause player

*!add youtube link or search query*
Add youtube video to queue

*!next*
Play next video from queue

*!queue*
Check video list in queue

*!clear*
Clear video list in queue
`)
}