import jwt from 'jsonwebtoken'
import Task from '../task'
import log from 'chalk-console'

import {Session,} from 'api/db/schema/session'
import staticConfig from 'lib/config'

export default class InvalidSessions extends Task {
  constructor () {
    super()

    this.name = 'invalid-sessions'
    this.cron = '00 00 * * * *'
    this.ping = process.env.SESSIONS_PING
  }

  async run () {
    const config = await staticConfig()
    const sessions = await Session.find({})
    const deletes = []

    sessions.forEach((session) => {
      try {
        log.info(`Verifying session ${session._id}`)
        jwt.verify(session.token, config.get('keypair.clientprivate'), {
          'issuer':     config.get('domain'),
          'algorithms': [
            'HS256',
          ],
        })
        log.info(`${session._id} valid`)
      } catch (error) {
        log.info(`${session._id} invalid, deleting`)
        deletes.push(session.remove())
      }
    })

    return Promise.all(deletes).then((result) => {
      log.info(`Deleted ${deletes.length} invalid sessions`)
      return result
    })
  }
}
