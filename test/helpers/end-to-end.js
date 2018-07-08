import test from 'ava'
import Nightmare from 'nightmare'
import hat from 'hat'
import {load as loadEnv,} from 'dotenv'
import smtp from 'smtp-tester'
import path from 'path'

const clientOptions = {
  'waitTimeout':      7000,
  'gotoTimeout':      7000,
  'loadTimeout':      7000,
  'executionTimeout': 13000,
  'typeInterval':     65,
  'show':             !process.env.CI,
}

const {'parsed': env,} = loadEnv({
  'path': '.env.local',
})
const {'parsed': testEnv,} = loadEnv({
  'path': '.test.env',
})

Object.keys(testEnv).forEach((key, index) => {
  env[key] = testEnv[key]
})

export {env,}
export const client = new Nightmare(clientOptions)
export const appURL = `http://${env.OUC_DOMAIN || 'dev.openusercss.local'}`
export const resolution = [1366, 768,]
export const username = hat(64)
export const password = hat(64)
export const email = `${env.TEST_MAIL_USER}+${username}@${env.TEST_MAIL_DOMAIN}`

export const getErrors = () => document.querySelector('.error-bag').innerHTML
export const getToast = () => document.querySelector('.iziToast-wrapper').innerHTML
export const getPath = () => location.pathname

let mailServer = null

test.before('Start fake mail server', (t) => {
  mailServer = smtp.init(2525)
})

test.before('Initialise Nightmare client', (t) => {
  return client
  .viewport(...resolution)
  .goto(appURL)
  .wait('.ouc-app-root')
})

test.beforeEach('Setup test context', (t) => {
  t.context.smtp = mailServer
  t.context.env = env
})

test.afterEach.always('Screenshot', (t) => {
  const title = (t.title || hat(64)).toLowerCase().replace(/[^a-z]/g, '-')
  const file = path.resolve('screenshots', title)

  if (t.context.noScreenshot) {
    return true
  }

  return client.screenshot(`${file}.png`)
})

test.after.always('Close fake mail server and Electron client', (t) => {
  return Promise.all([
    mailServer.stop(),
    client.end(),
  ])
})

export default test
