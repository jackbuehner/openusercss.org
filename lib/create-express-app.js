import express from 'express'
import morgan from 'morgan'
import raven from 'raven'

export default ({config,}) => {
  const app = express()

  if (config.get('env') === 'production') {
    raven.config(config.get('sentry.client')).install()
    app.use(raven.requestHandler())
    app.use(raven.errorHandler())
    app.use(morgan('combined'))
  }

  app.enable('trust proxy')
  app.set('trust proxy', true)
  app.set('env', config.get('env'))

  return app
}
