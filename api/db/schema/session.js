import mongoose, {crud,} from '../interface/crud'
import moment from 'moment'

const sessionSchema = crud({
  'expiresAt': {
    'type':     Date,
    'required': true,
    'validate': {
      validator (value) {
        const diff = moment(value).diff(moment(), 'days')

        return diff < 60
      },
      message (props) {
        return `Expiration date is over 60 days, got ${props.value}`
      },
    },
  },
  'token': {
    'type':     String,
    'required': true,
  },
  'ip': {
    'type':     String,
    'required': true,
  },
  'ua': {
    'type':     String,
    'required': true,
  },
})

export const Session = mongoose.model('Session', sessionSchema)
