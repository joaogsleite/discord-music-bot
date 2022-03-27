import fs from 'fs'
import { Log } from 'services/log'

const log = Log('crons/index')

fs.readdirSync(__dirname).map((file) => {
  return file.split('.')[0]
}).filter((cronName) => {
  return cronName !== 'index'
}).forEach(async (cronName) => {
  log('Starting', cronName)
  const { handler } = await import(`./${cronName}`)
  handler()
  log('Started', cronName)
})
