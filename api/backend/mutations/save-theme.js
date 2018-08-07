import mustAuthenticate from 'lib/enforce-session'
import matomoTransformer from 'lib/matomo-to-graphql'

import moment from 'moment'

export default async (root, {
  title,
  description,
  content,
  version,
  id,
  screenshots,
  variables,
  license,
}, {Session, Theme, User, Rating, Option, token, matomo,}, {fieldNodes,}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await User.findOne({
    '_id': session.user._id.toString(),
  })
  let newTheme = null

  if (!user.emailVerified) {
    throw new Error('email-not-verified')
  }

  if (id) {
    newTheme = await Theme.findOne({
      '_id': id,
    })
    const userOwnsTheme = session.user._id.equals(newTheme.user._id)

    if (!newTheme || !userOwnsTheme) {
      throw new Error('no-such-theme')
    }

    newTheme.title = title
    newTheme.description = description
    newTheme.version = version
    newTheme.content = content
    newTheme.screenshots = screenshots
    newTheme.variables = variables
    newTheme.license = license

    user.lastSeenReason = 'updating a theme'
  } else {
    newTheme = Theme.create({
      user,
      content,
      description,
      variables,
      title,
      version,
      screenshots,
      license,
    })

    user.lastSeenReason = 'uploading a new theme'
  }

  const savedTheme = await newTheme.save()

  user.lastSeen = moment().toJSON()
  await user.save()

  if (JSON.stringify(fieldNodes).includes('stats')) {
    const stats = await matomo.query({
      'method':  'Actions.getPageUrl',
      'pageUrl': `/theme/${id}`,
      'period':  'range',
      'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
      'flat':    1,
      'segment': 'pageUrl!@viewingSource;pageUrl!@edit;pageUrl=@%2Ftheme%2F',
    })

    savedTheme.stats = matomoTransformer(stats)
  }

  return savedTheme
}
