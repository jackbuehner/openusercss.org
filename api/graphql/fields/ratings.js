export default {
  'name':  'Rating',
  'query': 'ratings',

  root (root, {id,}, {Rating,}) {
    return Rating.findById(id)
  },

  'Rating': {
    createdBy ({createdBy,}, data, {User,}) {
      return User.findById(createdBy)
    },

    updatedBy ({updatedBy,}, data, {User,}) {
      return User.findById(updatedBy)
    },
  },
}
