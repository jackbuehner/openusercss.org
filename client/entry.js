import log from 'chalk-console'

import signals from 'lib/express/signal-handler'
import {clientInit, clientServer,} from '~/combiner'

clientInit().catch(log.error)

signals({
  'name':   'CLIENT',
  'thread': process,
  cleanup () {
    clientServer.close()
  },
})
