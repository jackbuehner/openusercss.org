import mongoose, {crud,} from '../interface/crud'
import validators from '../validators'

const userSchema = crud({
  'email': {
    'type':     String,
    'unique':   true,
    'required': true,
    'validate': {
      validator (value) {
        const format = validators.regex({
          'preset': 'email',
        })
        const length = value.length <= 256

        return format && length
      },
      message (props) {
        return `${props.value} is not a valid e-mail address, or is over 256 characters`
      },
    },
  },
  'pendingEmail': {
    'type':     String,
    'unique':   true,
    'required': false,
    'default':  '',
    'validate': {
      validator (value) {
        const format = validators.regex({
          'preset': 'email',
        })
        const length = value.length <= 256

        return format && length
      },
      message (props) {
        return `${props.value} is not a valid e-mail address, or is over 256 characters`
      },
    },
  },
  'emailVerified': {
    'type':     Boolean,
    'required': true,
  },
  'password': {
    'type':     String,
    'required': true,
  },
  'lastSeenAt': {
    'type':     Date,
    'required': true,
  },
  'lastSeenReason': {
    'type':     String,
    'required': false,
    'default':  'registering',
  },
  'bio': {
    'type':     String,
    'required': false,
    'default':  '',
    'validate': {
      validator (value) {
        return value.length <= 2048
      },
      message (props) {
        return `Bio must not be over 2048 characters. Got ${props.value.length}`
      },
    },
  },
  'donationUrl': {
    'type':     String,
    'required': false,
    'default':  '',
    'validate': {
      validator (value) {
        const format = validators.regex({
          'preset': 'url',
        })
        const length = value.length <= 512

        return format && length
      },
      message (props) {
        return 'Donation URL is not a valid URL or is longer than 512 characters'
      },
    },
  },
  'avatarUrl': {
    'type':     String,
    'required': true,
    'validate': {
      validator (value) {
        const format = validators.regex({
          'preset': 'url',
        })

        return format
      },
      message (props) {
        return 'Avatar URL is not a valid URL'
      },
    },
  },
  'smallAvatarUrl': {
    'type':     String,
    'required': true,
    'validate': {
      validator (value) {
        const format = validators.regex({
          'preset': 'url',
        })

        return format
      },
      message (props) {
        return 'Small avatar URL is not a valid URL'
      },
    },
  },
})

export const User = mongoose.model('User', userSchema)
