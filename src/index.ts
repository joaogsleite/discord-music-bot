import * as Env from './services/env'
import * as Discord from './services/discord'

(async function(){
  await Env.init()
  await Discord.init()
  await import('./events')
})();
