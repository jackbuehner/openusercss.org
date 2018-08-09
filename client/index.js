import secure from 'lib/express/secure'
import routes from 'client/lib/routes'

export const handler = async ({app, config, mode,}) => {
  await secure({app, config, mode,})
  await routes({app, config, mode,})

  return {app,}
}
