import matomoTransformer from 'api/lib/matomo-to-graphql'
import moment from 'moment'

export default async (root, {id,}, {User, Theme, matomo,}, {fieldNodes,}) => {
  const result = await Theme.findOne({
    '_id': id,
  }, {
    'populate': true,
  })

  if (!result) {
    throw new Error('no-such-theme')
  }

  if (JSON.stringify(fieldNodes).includes('stats')) {
    const stats = await matomo.query({
      'method':  'Actions.getPageUrl',
      'pageUrl': `/theme/${id}`,
      'period':  'range',
      'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
      'flat':    1,
      'segment': 'pageUrl!@viewingSource;pageUrl!@edit;pageUrl=@%2Ftheme%2F',
    })

    result.stats = matomoTransformer(stats)
  }

  return result
}
