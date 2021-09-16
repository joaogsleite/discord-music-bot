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
  } = process.env
  const env = {
    SSH_SERVER,
    SSH_FOLDER,
    DISCORD_TOKEN,
    DISCORD_CHANNEL,
  }
  log('env loaded', {
    SSH_SERVER,
    SSH_FOLDER,
    DISCORD_TOKEN,
    DISCORD_CHANNEL,
  })
  return env
}

export async function getEnv() {
  return process.env
}