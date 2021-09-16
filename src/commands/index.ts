import fs from 'fs'
import * as discord from 'services/discord'
import { Log } from 'services/log'

const log = Log('commands/index')

const client = discord.getClient()

let processingMessage = false
let timeout: NodeJS.Timeout

const commandNames = fs.readdirSync(__dirname).map((file) => {
  return file.split('.')[0]
})
const commandHandlers: Record<string, any> = {}
commandNames.forEach(async (commandName) => {
  commandHandlers[commandName] = (await import(`./${commandName}.ts`)).handler
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  log('message received', message.content)
  try {
    if (message.content.startsWith('!')) {
      const commandName = message.content.substr(1).split(' ')[0]
      if (commandNames.find((c) => c === commandName)) {
        processingMessage = true
        timeout = setTimeout(() => {
          processingMessage = false
        }, 5000)
        message.channel.sendTyping()
        const arg = message.content.substr(1 + commandName.length).trim()
        await commandHandlers[commandName](message, arg)
        clearInterval(timeout)
        processingMessage = false
      } else {
        message.reply(`Command *!${commandName}* not supported`)
      }
    }
  } catch (error) {
    message.reply('Error processing your message')
    log('error processing message', {
      message: message.content,
      error
    })
  }
})