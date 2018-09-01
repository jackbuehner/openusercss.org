import log from 'chalk-console'
import {sync as getConfig,} from 'lib/config'
import mongoose from 'mongoose'

import {Theme,} from './schema/theme'
import {User,} from './schema/user'
import {Session,} from './schema/session'
import {Rating,} from './schema/rating'

import migrateMongoose from './migrate-mongoose'

const init = () => new Promise((resolve, reject) => {
  const config = getConfig()
  const connectionUrl = config.get('database.main')

  mongoose.connect(connectionUrl, {
    'useNewUrlParser':   true,
    // Try reconnecting for an hour, then give up
    'reconnectInterval': 2500,
    'reconnectTries':    1440,
  })

  const db = mongoose.connection

  db.on('error', log.error)
  db.once('open', resolve)
})

const postInit = async () => {
  log.info('Database ready')

  if (process.env.MIGRATE === 'mongoose') {
    await migrateMongoose({
      Theme,
      User,
      Session,
      Rating,
    })
  }
}

init()
.then(postInit)
.catch(log.error)

export default () => {
  return {
    Theme,
    User,
    Session,
    Rating,
  }
}
