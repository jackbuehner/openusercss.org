<script>
  import {mapGetters, mapActions,} from 'vuex'
  import progressiveImage from '../bits/progressive-image.vue'

  import pkg from '~/../package.json'

  export default {
    'components': {
      progressiveImage,
    },
    'methods': {
      ...mapActions({
        'logout': 'session/logout',
      }),
      toggleOpen () {
        this.open = !this.open
      },
      close () {
        this.open = false
      },
    },
    'computed': {
      ...mapGetters({
        'session': 'session/data',
        'viewer':  'session/viewer',
      }),
      'release': () => pkg.release.replace(/\w\S*/g, (text) => {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
      }),
      viewerId () {
        if (!this.viewer) {
          return null
        }

        return this.viewer._id
      },
    },
    data () {
      return {
        'open': false,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/component';

  $primary: map-get($colors, 'primary');
  $secondary: map-get($colors, 'secondary');
  $dark: map-get($colors, 'primary-dark');
  $background: map-get($colors, 'background');

  .navbar {
    position: fixed;
    width: 100%;
    z-index: 100;
    height: map-get($kerning, 'navbar-height');

    .container,
    .navbar-brand,
    .navbar-burger {
      height: 100%;
    }
  }

  .body-spacer {
    height: map-get($kerning, 'navbar-height');
  }

  .navbar-menu {
    * {
      color: white;
    }

    &.is-active {
      border-top: 5px nth($secondary, 1) solid;

      .navbar-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.5rem;
      }
    }
  }

  .spacer {
    width: .75rem;
  }

  .navbar-item:not(.no-active) {
    &.nuxt-link-exact-active {
      background-color: nth($background, 1);
      color: nth($background, 2);
    }
  }

  @supports (backdrop-filter: brightness(80%)) {
    .navbar-item {
      &:hover {
        background: transparent !important;
        backdrop-filter: brightness(80%);
      }
    }
  }
</style>

<template lang="pug">
  div.ouc-navbar-wrapper
    .navbar.ouc-navbar.is-primary.is-brand-primary.md-shadow--2
      .container
        .navbar-brand.ouc-navbar-brand
          nuxt-link(:to="localePath('/')").navbar-item.no-active
            progressive-image(
              src="/img/openusercss.icon.svg",
              placeholder="/img/openusercss.icon-x16.png",
              height="2.25rem",
              width="2.25rem"
            )
            .spacer
            span OpenUserCSS
            .spacer
            .tag.is-secondary
              | {{release}}!
          .navbar-burger(@click="toggleOpen")
            span
            span
            span
        .navbar-menu.is-primary.ouc-navbar-menu(:class="{'is-active': open, 'is-brand-primary': open}")
          .navbar-start
          .navbar-end(@click="close")
            nuxt-link(v-show="session", :to="localePath({name: 'profile', params: {id: 'thing'}})").navbar-item
              fa-icon(icon="user")
              | {{$t('welcome-username', {'username': viewer ? viewer.displayname : 'Guest'})}}
            a(v-show="session", @click.prevent="logout").navbar-item
              fa-icon(icon="sign-out-alt")
              | {{$t('log-out')}}
            nuxt-link(:to="localePath('/')").navbar-item
              fa-icon(icon="home")
              | {{$t('home')}}
            nuxt-link(v-show="!session", :to="localePath('login')").navbar-item
              fa-icon(icon="sign-in-alt")
              | {{$t('log-in')}}
            nuxt-link(v-show="!session", :to="localePath('register')").navbar-item
              fa-icon(icon="user-plus")
              | {{$t('register')}}
            nuxt-link(:to="localePath('search')").navbar-item
              fa-icon(icon="search")
              | {{$t('search')}}
            a(href="//forums.openusercss.org").navbar-item
              fa-icon(icon="users")
              | {{$t('forums')}}
            nuxt-link(:to="localePath('help')").navbar-item
              fa-icon(icon="question-circle")
              | {{$t('help')}}

    .body-spacer
</template>
