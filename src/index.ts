import * as Env from './services/env'
import * as Discord from './services/discord'
import * as State from 'services/state'

(async function(){
  await Env.init()
  await Discord.init()
  await State.restore()
  await import('./crons')
  await import('./commands')
})()
