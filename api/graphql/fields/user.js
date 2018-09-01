import moment from 'moment'
import matomoTransformer from 'api/lib/matomo-to-graphql'

export default {
  'name':  'User',
  'query': 'user',

  root (root, {id,}, {User,}) {
    return User.findById(id)
  },

  'User': {
    createdBy ({createdBy,}, data, {User,}) {
      return User.findById(createdBy)
    },

    updatedBy ({updatedBy,}, data, {User,}) {
      return User.findById(updatedBy)
    },

    themes ({id,}, data, {Theme,}) {
      return Theme.find({
        'createdBy': id,
      })
    },

    async stats ({id,}, data, {matomo,}) {
      const stats = await matomo.query({
        'method':  'Actions.getPageUrl',
        'pageUrl': `/profile/${id}`,
        'period':  'range',
        'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
        'flat':    1,
        'segment': 'pageUrl!@edit',
      })

      return matomoTransformer(stats)
    },
  },
}
