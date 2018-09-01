import mongoose, {crud,} from '../interface/crud'
import validators from '../validators'

const themeSchema = crud({
  'description': {
    'type':     String,
    'required': true,
    'validate': {
      validator (value) {
        return value.length <= 2048
      },
      message (props) {
        return 'Theme description is too long, at most 2048 bytes are allowed'
      },
    },
  },
  'content': {
    'type':     String,
    'required': true,
    'validate': {
      validator (value) {
        return value.length < 102400
      },
      message (props) {
        return 'Theme content is too long, at most 102400 bytes are allowed'
      },
    },
  },
  'version': {
    'type':     String,
    'required': true,
    'validate': {
      validator (value) {
        return validators.isSemver(value)
      },
      message (props) {
        return `${props.value} is not semantically versioned`
      },
    },
  },
  'license': {
    'type':     String,
    'required': true,
    'validate': {
      validator (value) {
        return validators.spdxLicense(value)
      },
      message (props) {
        return `${props.value} is not one of the acceptable licenses`
      },
    },
  },
  'screenshots': {
    'type': [
      {
        'url': {
          'type':     String,
          'required': true,
          'validate': {
            validator (value) {
              return value.length <= 512
            },
            message (props) {
              return 'Screenshot URL length must not be over 512 characters'
            },
          },
        },
      },
    ],
    'validate': {
      validator (value) {
        return value.length <= 10
      },
      message (props) {
        return `At most 10 screenshots are allowed, got ${props.value.length}`
      },
    },
    'required': true,
  },
  'variables': [
    {
      'type': {
        'type':     String,
        'required': true,
        'validate': {
          validator (value) {
            return [
              'text',
              'color',
              'select',
              'checkbox',
            ].includes(value)
          },
          message (props) {
            return `${props.value} is not a valid type. Must be one of test, color, select, checkbox`
          },
        },
      },
      'label': {
        'type':     String,
        'required': true,
        'validate': {
          validator (value) {
            return value.length < 64
          },
          message (props) {
            return 'Label is too long, at most 64 bytes are allowed'
          },
        },
      },
      'name': {
        'type':     String,
        'required': true,
        'validate': {
          validator (value) {
            return value.length < 64
          },
          message (props) {
            return 'Name is too long, at most 64 bytes are allowed'
          },
        },
      },
      'value': {
        'type':     String,
        'required': false,
        'validate': {
          validator (value) {
            return (value || '').length < 64
          },
          message (props) {
            return 'Value is too long, at most 64 bytes are allowed'
          },
        },
      },
      'default': {
        'type':     String,
        'required': true,
        'validate': {
          validator (value) {
            return value.length < 64
          },
          message (props) {
            return 'Default value is too long, at most 64 bytes are allowed'
          },
        },
      },
      'options': [
        {
          'label': {
            'type':     String,
            'required': true,
            'validate': {
              validator (value) {
                return value.length < 64
              },
              message (props) {
                return 'Option label is too long, at most 64 bytes are allowed'
              },
            },
          },
          'name': {
            'type':     String,
            'required': true,
            'validate': {
              validator (value) {
                return value.length < 64
              },
              message (props) {
                return 'Option name is too long, at most 64 bytes are allowed'
              },
            },
          },
          'value': {
            'type':     String,
            'required': true,
            'validate': {
              validator (value) {
                return value.length < 64
              },
              message (props) {
                return 'Option value is too long, at most 64 bytes are allowed'
              },
            },
          },
        },
      ],
    },
  ],
})

export const Theme = mongoose.model('Theme', themeSchema)
