<script>
  import {mapGetters,} from 'vuex'

  import notification from '~/components/elements/notification.vue'
  import oucButton from '~/components/elements/ouc-button.vue'
  import bInput from '~/components/bits/b-input.vue'

  export default {
    'components': {
      oucButton,
      notification,
      bInput,
    },
    'props': {
      'submit': {
        'required': true,
        'type':     Function,
      },
      'value':        Object,
      'buttonColour': String,
      'submitText':   String,
    },
    data () {
      return {
        'loginData': {
          'email':    '',
          'password': '',
        },
      }
    },
    'methods': {
      async validateAndSubmit () {
        const valid = await this.$validator.validateAll()

        if (valid) {
          this.submit(this.loginData)
        }
      },
    },
    'computed': mapGetters({
      'viewer':  'session/viewer',
      'loading': 'session/loading',
    }),
  }
</script>

<style lang="scss" scoped>
  .has-margin-right {
    margin-right: .5rem;
  }
</style>

<template lang="pug">
  mixin login-button-content
    fa-icon.has-margin-right(icon="sign-in-alt")
    p {{submitText | placeholder('Login')}}

  form(@submit.prevent="validateAndSubmit", @change="$emit('input', loginData)").ouc-login-form
    .tile.is-ancestor
      .tile.is-parent.is-vertical
        .tile.is-child
          .field
            .control.has-icons-left
              fa-icon.icon(icon="envelope")
              input.input(
                type="email",
                name="email",
                autocomplete="email",
                placeholder="E-mail",
                v-validate.disable="'required|email'",
                v-model="loginData.email",
                :class="{'input': true, 'is-danger': errors.has('email') }",
                data-vv-as="e-mail",
                aria-label="login e-mail"
              )
        .tile.is-child
          .columns
            .column
              .field
                .control.has-icons-left
                  fa-icon.icon(icon="lock")
                  input.input(
                    type="password",
                    name="password",
                    autocomplete="current-password",
                    placeholder="Passphrase",
                    v-validate.disable="'required'",
                    v-model="loginData.password"
                    :class="{'input': true, 'is-danger': errors.has('password') }",
                    data-vv-as="passphrase",
                    aria-label="login passphrase"
                  )
        .tile.is-parent.is-paddingless.is-vertical.has-text-left
          .tile.is-child
            button.button(
              v-if="buttonColour",
              type="submit",
              :class="['is-' + buttonColour, {'is-loading': loading}]"
            )
              +login-button-content

            button.button.is-primary(
              v-else,
              type="submit",
              :class="{'is-loading': loading}"
            )
              +login-button-content

          .tile.is-child
            notification.is-danger.error-bag(v-show="errors.any()", icon="exclamation", color="is-danger")
              div(slot="content")
                ul
                  li(v-for="error in errors.all()") {{error}}
</template>
