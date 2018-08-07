import log from 'chalk-console'

import signals from 'lib/express/signal-handler'
import {apiInit, apiServer,} from '~/combiner'

apiInit().catch(log.error)

signals({
  'name':   'API',
  'thread': process,
  cleanup () {
    apiServer.close()
  },
})
