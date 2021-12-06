import dotenv from 'dotenv'
import { Log } from './log'

const log = Log('services/env')

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SSH_SERVER: string
      SSH_FOLDER: string
      DISCORD_TOKEN: string
      DISCORD_CHANNEL: string
      DISCORD_GUILD: string
    }
  }
}

export async function init() {
  dotenv.config()
  const {
    SSH_SERVER,
    SSH_FOLDER,
    DISCORD_TOKEN,
    DISCORD_CHANNEL,
    DISCORD_GUILD,
  } = process.env
  const env = {
    SSH_SERVER,
    SSH_FOLDER,
    DISCORD_TOKEN,
    DISCORD_CHANNEL,
    DISCORD_GUILD,
  }
  log('env loaded', {
    SSH_SERVER,
    SSH_FOLDER,
    DISCORD_TOKEN,
    DISCORD_CHANNEL,
    DISCORD_GUILD,
  })
  return env
}

export async function getEnv() {
  return process.env
}