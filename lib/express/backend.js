import schema from 'api/backend'
import connectMongo from 'api/connector'
import MatomoApi from 'matomo-reporting-js'
import fetch from 'node-fetch'

const connection = connectMongo()
const matomo = new MatomoApi({
  fetch,
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
