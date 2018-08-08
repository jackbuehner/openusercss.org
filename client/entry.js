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

  log.info(`CLIENT environment: ${app.get('env')}`)

  await handler({
    app,
    config,
    'mode': 'client',
  })

  server = http.createServer(app)

  server.listen(config.get('ports.frontend.http'))
  log.info(`CLIENT started (http): ${JSON.stringify(config.get('ports.frontend.http'))}`)
}

init().catch(log.error)

signals({
  'name':   'CLIENT',
  'thread': process,
  cleanup () {
    if (server) {
      server.close()
    }
  },
})
