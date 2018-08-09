import schema from 'api/backend'
import connectMongo from 'api/connector'
import MatomoApi from 'matomo-reporting-js'
import fetch from 'node-fetch'
import raven from 'raven'
import {Agent,} from 'https'

const agent = new Agent({
  'rejectUnauthorized': false,
})
const connection = connectMongo()
const matomo = new MatomoApi({
  fetch,
  agent,
  'handler': (error) => {
    raven.captureException(error)
    /* eslint-disable-next-line no-console */
    console.error(error)
  },
}, {
  'endpoint': 'https://pwk.decentm.com/index.php',
  'idSite':   10,
})

export default (req, res, next) => {
  return connection.then((db) => ({
    'context': {
      'token': req.headers.authorization,
      matomo,
      ...req,
      ...db,
    },
    schema,
  }))
}
