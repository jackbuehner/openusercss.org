import mongoose, {managed, Schema,} from '../interface/managed'

const ratingSchema = managed({
  'createdBy': {
    'type':     Schema.Types.ObjectId,
    'required': true,
    'ref':      'User',
  },
  'theme': {
    'type':     Schema.Types.ObjectId,
    'ref':      'Theme',
    'required': true,
  },
  'value': {
    'type':     Number,
    'required': true,
    'validate': {
      validator (value) {
        return [-1, 1,].includes(value)
      },
      message (props) {
        return `${props.value} is not a valid rating (must be 1 or -1)`
      },
    },
  },
})

export const Rating = mongoose.model('Rating', ratingSchema)
