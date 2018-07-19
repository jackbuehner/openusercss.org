<script>
  import loginForm from '~/components/forms/login.vue'

  export default {
    'layout':     'bare',
    'components': {
      loginForm,
    },
    data () {
      return {
        'loginData': {
          'username': '',
          'password': '',
        },
      }
    },
    'methods': {
      async login () {
        const valid = await this.$validator.validateAll()

        if (valid) {
          try {
            await this.$store.dispatch('session/login', this.loginData)
            this.$router.push({
              'path': '/',
            })
          } catch (error) {
            this.$toast.error(error.message, 'Error')
          }
        }
      },
    },
    'computed': {
      appName () {
        return this.$route.query.appName
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/component';

  .oauth-card {
    @include smart-padding(2rem);

    max-width: 500px;
    width: 100%;
    min-width: 300px;

    min-height: 300px;
    height: 100%;
  }
</style>

<template lang="pug">
  .ouc-route-root.is-vcentered.is-hcentered
    .section
      .container.has-text-centered.is-hcentered
        .is-brand-primary.oauth-card
          img(src="/img/openusercss.icon-x128.png", height="96", width="96")
          h5.
            An application would like to request the following information
            from your account:

          .content.permission-list.has-text-left
            ul
              li Username
              li Profile picture
          //- h3 {{appName | placeholder('Unknown Application')}}
          hr
          login-form(
            :submit="login",
            v-model="loginData",
            button-colour="secondary",
            submit-text="Authorise"
          )
</template>
