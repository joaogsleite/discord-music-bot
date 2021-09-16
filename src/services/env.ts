import dotenv from 'dotenv'

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
  return process.env
}

export async function getEnv() {
  return process.env
}