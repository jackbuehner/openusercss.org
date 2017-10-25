import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import icon from '../../elements/icon/icon.vue'
import notification from '../../elements/notification/notification.vue'
import button from '../../elements/button/button.vue'

console.warn('You\'re still using this component, which is deprecated (in-sets)')

export default {
  'components': {
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-field':     bulma('field', 'div'),
    'b-label':     bulma('label', 'label'),
    'b-input':     bulma('input', 'input'),
    'b-textarea':  bulma('textarea', 'textarea'),
    'b-select':    bulma('select', 'select'),
    'b-control':   bulma('control', 'div'),
    'b-checkbox':  bulma('checkbox', 'checkbox'),
    'b-radio':     bulma('radio', 'radio'),
    'b-button':    bulma('button', 'button'),
    'b-help':      bulma('help', 'p'),
    'b-tile':      bulma('tile', 'div'),
    'big-button':  button,
    icon,
    notification
  },
  'data': () => {
    return {
      'login': {
        'email':    '',
        'password': ''
      }
    }
  },
  'methods': {
    async submitLogin () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('updateFormData', this.login)
        this.$store.dispatch('login', this.login)
      }
    }
  },
  'computed': mapGetters([
    'actionErrors'
  ])
}