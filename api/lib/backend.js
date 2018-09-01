import schema from 'api/graphql'
import MatomoApi from 'matomo-reporting-js'
import fetch from 'node-fetch'
import raven from 'raven'
import {Agent,} from 'https'

import db from 'api/db'

const agent = new Agent({
  'rejectUnauthorized': false,
})
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
  const model = db()

  return {
    'tracing': process.env.NODE_ENV === 'development',
    'context': {
      'token': req.headers.authorization,
      matomo,
      ...req,
      ...model,
    },
    schema,
  }
}
