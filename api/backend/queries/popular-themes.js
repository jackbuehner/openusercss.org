import {ObjectID,} from 'mongodb'

export default async (root, {limit,}, {User, Theme, Rating, matomo,}) => {
  const upperLimit = 25
  const lowerLimit = 1

  if (limit > upperLimit || limit < lowerLimit) {
    throw new Error(`limit must be at most ${upperLimit} and at least ${lowerLimit}`)
  }

  const matomoStats = await matomo.query({
    'method':       'Actions.getPageUrls',
    'idSubtable':   3,
    'segment':      'pageUrl!@viewingSource',
    'filter_limit': limit,
  })
  const stats = matomoStats.map((stat) => {
    if (stat.label.length !== 25) {
      return null
    }

    return {
      'theme':  stat.label.substring(1),
      'visits': stat.nb_visits,
    }
  }).filter(Boolean)

  const finds = []

  stats.forEach(({theme, visits,}) => {
    finds.push(Theme.findOne({
      '_id': new ObjectID(theme),
    }))
  })

  const result = await Promise.all(finds)

  return result.filter(Boolean)
}
