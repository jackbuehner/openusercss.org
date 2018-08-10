import log from 'chalk-console'
import signals from 'lib/express/signal-handler'
import staticConfig from 'lib/config'
import createApp from 'lib/create-express-app'
import http from 'http'
import {handler,} from '.'

let server = null

const init = async () => {
  const config = await staticConfig()
  const app = createApp({config,})

  log.info(`API environment: ${app.get('env')}`)

  await handler({
    app,
    config,
    'mode': 'api',
  })

  server = http.createServer(app)

  server.listen(config.get('ports.api.http'))
  log.info(`API started (http): ${JSON.stringify(config.get('ports.api.http'))}`)
}

init().catch((error) => log.error(error.stack))

signals({
  'name':   'API',
  'thread': process,
  cleanup () {
    if (server) {
      server.close()
    }
  },
})
