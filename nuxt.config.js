const rucksack = require('rucksack-css')
const willChange = require('postcss-will-change')
const willChangeTransition = require('postcss-will-change-transition')
const ellipsis = require('postcss-ellipsis')

const postcss = [
  // Syntax extending plugins
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false,
  }),
  ellipsis(),
  willChange(),
  willChangeTransition(),
]

module.exports = {
  // dev,
  'srcDir': './app',
  'head':   {
    'titleTemplate': '%s - OpenUserCSS',
    'meta':          [
      {'charset': 'utf-8',},
      {'http-equiv': 'x-ua-compatible', 'content': 'ie=edge',},
      {'name': 'skype_toolbar', 'content': 'skype_toolbar_parser_compatible',},
      {'name': 'msapplication-tap-highlight', 'content': 'no',},
      {'name': 'renderer', 'content': 'webkit|ie-comp|ie-stand',},
      {'name': 'x5-page-mode', 'content': 'app',},
      {'name': 'browsermode', 'content': 'application',},
      {'name': 'wap-font-scale', 'content': 'no',},
      {'name': 'viewport', 'content': 'width=device-width, initial-scale=1, shrink-to-fit=no',},
      {'name': 'application-name', 'content': 'OpenUserCSS',},
      {'name': 'robots', 'content': 'index,follow',},
      {'name': 'format-detection', 'content': 'telephone=no',},
      {'name': 'mobile-web-capable', 'content': 'yes',},
    ],
    'link': [
      {'rel': 'license', 'href': '//github.com/OpenUserCSS/openusercss.org/LICENSE',},
      {'rel': 'me', 'href': '//decentm.com',},
    ],
  },
  'loading': '~/components/elements/loading.vue',
  'css':     [
    'css-reset-and-normalize-sass',
    'md-shadows',
    './node_modules/flickity/css/flickity.css',
    './node_modules/izitoast/dist/css/iziToast.css',
    './node_modules/@riophae/vue-treeselect/dist/vue-treeselect.min.css',
    '~/scss/main.scss',
  ],
  'build': {
    postcss,

    'extractCSS':   true,
    'optimization': {
      'splitChunks': {
        'name':        true,
        'cacheGroups': {
          'styles': {
            'name':    'styles',
            'test':    /\.(css|vue)$/,
            'chunks':  'all',
            'enforce': true,
          },
        },
      },
    },

    extend (config, ctx) {
      config.module.rules.push({
        'test':   /\.pug$/,
        'loader': 'pug-plain-loader',
      })

      config.module.rules.push({
        'test': /\.md$/,
        'use':  [
          {
            'loader': 'html-loader',
          },
          {
            'loader': 'markdown-loader',
          },
        ],
      })

      return config
    },
  },
  'env': {
    'NODE_ENV':    process.env.NODE_ENV,
    'DOMAIN':      process.env.DOMAIN,
    'OUC_DOMAIN':  process.env.OUC_DOMAIN,
    'OUC_STAGING': process.env.OUC_STAGING,
  },
  'plugins': [
    '~/plugins/matomo-api.js',
    '~/plugins/average-rating.js',
    '~/plugins/vue-moment.js',
    '~/plugins/vue-markdown.js',
    '~/plugins/vue-filters.js',
    '~/plugins/vue-modal.js',
    '~/plugins/vue-apollo.js',
    '~/plugins/vue-noscript.js',
    '~/plugins/vee-validate.js',
    '~/plugins/extension-data.js',
    '~/plugins/static-data.js',
    '~/plugins/proxy-image.js',
    {
      'src': '~/plugins/izitoast.js',
      'ssr': false,
    },
    {
      'src': '~/plugins/vuex-persist.js',
      'ssr': false,
    },
  ],
  'modules': [
    '~/modules/apollo.js',
    [
      'nuxt-fontawesome', {
        'component': 'fa-icon',
        'imports':   [
          {
            'set':   '@fortawesome/free-solid-svg-icons',
            'icons': [
              'fas',
            ],
          },
        ],
      },
    ],
    [
      'nuxt-matomo', {
        'matomoUrl': '//pwk.decentm.com/',
        'siteId':    10,
        'cookies':   false,
      },
    ],
    [
      '@nuxtjs/pwa', {
        'icon': {
          'iconSrc': 'app/static/img/openusercss.icon-x128.png',
        },
        'workbox': {
          'runtimeCaching': [
            {
              'urlPattern': 'https://pwk.decentm.com/.*',
              'handler':    'staleWhileRevalidate',
              'method':     'GET',
            },
            {
              'urlPattern': 'https://imageproxy.openusercss.org/.*',
              'handler':    'staleWhileRevalidate',
              'method':     'GET',
            },
            {
              'urlPattern': 'https://gravatar.com/avatar/.*',
              'handler':    'staleWhileRevalidate',
              'method':     'GET',
            },
          ],
        },
        'manifest': {
          'name':             'OpenUserCSS',
          'short_name':       'OpenUserCSS',
          'description':      'Themes for your favourite websites',
          'display':          'standalone',
          'theme_color':      '#005FFF',
          'background_color': '#3E28B0',
          'start_url':        '/?utm_source=homescreen',
          'lang':             'en',
          'icons':            [
            {
              'src':   '/img/openusercss.icon-x16.png',
              'sizes': '16x16',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x32.png',
              'sizes': '32x32',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x64.png',
              'sizes': '64x64',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x128.png',
              'sizes': '128x128',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x360.png',
              'sizes': '360x360',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x640.png',
              'sizes': '640x640',
              'type':  'image/png',
            },
          ],
        },
      },
    ],
  ],
}
