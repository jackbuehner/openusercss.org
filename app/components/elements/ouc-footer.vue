<script>
  import flags from 'emoji-flags'

  import versionQuery from '~/apollo/queries/version.gql'
  import progressiveImage from '../bits/progressive-image.vue'
  import changelog from '~/../CHANGELOG.md'

  export default {
    'apollo': {
      'version': versionQuery,
    },
    'components': {
      progressiveImage,
    },
    'computed': {
      changelog () {
        return changelog
      },
      currentLocale () {
        const locale = this.$i18n.locales.find((localeItem) => {
          return localeItem.code === this.$i18n.locale
        })

        if (!locale) {
          return 'English'
        }

        return locale.name
      },
      flag () {
        const emojiMap = {
          'en': 'GB',
        }

        return (code) => {
          const short = code.slice(-2)
          const found = flags.countryCode(emojiMap[short.toLowerCase()] || short)

          if (!found) {
            // eslint-disable-next-line no-console
            console.warn(`Cannot find flag emoji for ${code}`)
            return ''
          }

          return found.emoji
        }
      },
    },
    mounted () {
      this.dev = this.dev || window.location.href.includes('staging')
    },
    data () {
      return {
        'version':    {},
        'dev':        process.env.NODE_ENV === 'development',
        'langFilter': '',
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/component';

  .footer {
    padding-bottom: 48px;
    color: #111;
  }

  .is-vertical {
    display: flex;
    flex-direction: column;
  }

  .bg-transparent {
    background: transparent;
  }

  .is-fullheight {
    height: 100%
  }

  .is-fullwidth {
    width: 100%
  }

  .is-flex {
    display: flex;
  }

  .patreon-logo {
    height: 100px;
    width: 100px;
  }

  .has-padding {
    padding: .25rem
  }

  .has-padding-1 {
    padding: 1rem
  }

  .v--modal .box {
    margin-top: 4rem;
  }

  .ouc-im-broke-wrapper {
    @include brand-gradient(map-get($tones, 'paypal'), map-get($tones, 'patreon'), 40%, 47.5%);
  }
</style>

<template lang="pug">
  mixin donation-button(link, text, imageSrc, imagePlaceholder, width)
    - text = text || 'Donate!'
    - width = width || '1.75rem'

    .tile.is-child
      a.button.is-fullheight.is-hidden-touch(href=link, target="_blank")&attributes(attributes)
        b #{text}
        .has-padding
        progressive-image(
          src=imageSrc,
          placeholder=imagePlaceholder,
          height="1.75rem",
          width=width,
          position="center center"
        )
      a.button.is-fullheight.is-fullwidth.is-hidden-desktop.has-padding-1(href=link, target="_blank")&attributes(attributes)
        b #{text}
        .has-padding
        progressive-image(
          src=imageSrc,
          placeholder=imagePlaceholder,
          height="1.5rem",
          width=width,
          position="center center"
        )

  div.ouc-footer-wrapper
    modal(
      name="language-switcher",
      height="auto",
      :scrollable="true"
    )
      .card
        .card-header
          .card-header-title.is-paddingless
            .notification.is-brand-primary.is-fullwidth
              fa-icon(icon="exclamation")
              | Please be aware that your language may not be fully translated yet!

        .card-content
          p Please choose a language to use:
          br
          .control.has-icons-left
            fa-icon.icon(icon="search")
            input.input(v-model="langFilter", placeholder="Type here to filter languages")
          br
          p(v-if="filterBy($i18n.locales, langFilter).length === 0 && langFilter")
            | No languages found for {{langFilter}}
          table.table.is-fullwidth.is-hoverable.is-striped
            tbody
              tr(
                v-for="locale in orderBy(filterBy($i18n.locales, langFilter), 'name')",
                v-if="locale.code !== $i18n.locale",
                :key="locale.code",
              )
                td.is-paddingless.is-flex
                  nuxt-link.is-fullwidth.has-padding(
                    :to="switchLocalePath(locale.code)"
                  )
                    | {{flag(locale.code)}} {{locale.name}}

    modal(
      name="changelog-viewer",
      height="auto",
      :scrollable="true"
    )
      .box
        div(v-html="changelog")

    .is-vertical.ouc-im-broke-wrapper
      .ouc-im-broke.is-fullheight
        .container
          .tile.is-parent.is-paddingless
            +donation-button(
              "//www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NQE35LHY6NKS6",
              "Donate!",
              "/img/paypal.icon-x64.png",
              "/img/paypal.icon-x16.png"
            ).is-paypal.is-pulled-left
            +donation-button(
              "//patreon.com/DecentM",
              "Become a patron!",
              "/img/patreon.icon-x64.png",
              "/img/patreon.icon-x16.png"
            ).is-patreon.is-pulled-right

    .footer.is-vertical.ouc-footer-content
      .container
        .columns
          .column.has-text-left
            .tile
              p
                | Copyright&nbsp;&copy;&nbsp;{{new Date().getFullYear()}}&nbsp;
                a(href="//github.com/DecentM", target="_blank") DecentM&#32;
                | and&#32;
                a(href="//github.com/OpenUserCSS/openusercss.org/blob/master/README.md#contributors", target="_blank") Contributors
            .tile
              p
                a(href="//forums.openusercss.org/topic/5/privacy-policy") Privacy policy
                | &#32;|&#32;
                a(href="//forums.openusercss.org/topic/6/terms-of-service") Terms of service
                | &#32;|&#32;
                router-link(to="/notice") Notice
          .column.has-text-centered
            a(href="//github.com/OpenUserCSS", target="_blank")
              fa-icon(icon="code-branch")
              | GitHub
            .ouc-language-selector
              fa-icon(icon="language")
              a(@click="$modal.show('language-switcher')")
                | {{$t('language', {'lang': currentLocale})}}

            div(v-if="dev")
              nuxt-link.has-text-primary(to="/test")
                | Open test page
          .column.has-text-right
            router-link(to="/contact")
              fa-icon(icon="envelope")
              | Contact the administrator
            p
              | API version: {{version.revisionTag}}
            p
              | Client version: {{$pkg.version}}
              |
              a(@click.prevent="$modal.show('changelog-viewer')") (changelog)
</template>
