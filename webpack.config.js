if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production') {
  throw new Error([
    'NODE_ENV must be either "development" or "production",',
    `got ${JSON.stringify(process.env.NODE_ENV)}`,
  ].join(' '))
}

const {
  DefinePlugin,
  BannerPlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin,
} = require('webpack')

const path = require('path')
const fs = require('fs')

const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const git = require('git-revision')

/* eslint-disable-next-line no-sync */
const licenses = fs.readFileSync('./licenses.json')

module.exports = {
  'target':    'node',
  'devtool':   'source-map',
  'mode':      process.env.NODE_ENV,
  'externals': nodeExternals({
    'whitelist': [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  'performance': {
    'hints': false,
  },
  'resolve': {
    'extensions': ['.js', '.json',],
    'alias':      {
      '~':      path.resolve(__dirname),
      'lib':    path.resolve(__dirname, 'lib'),
      'api':    path.resolve(__dirname, 'api'),
      'client': path.resolve(__dirname, 'client'),
    },
  },
  'node': {
    '__filename': true,
    '__dirname':  true,
  },
  'entry': {
    'api': [
      './api/entry.js',
    ],
    'client': [
      './client/entry.js',
    ],
  },
  'output': {
    'path':              path.resolve('./build'),
    'filename':          '[name].js',
    'sourceMapFilename': '[name].map',
    'publicPath':        '/',
    'libraryTarget':     'commonjs2',
  },
  'plugins': [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__':              process.env.NODE_ENV === 'development',
      'OUC.version':          {
        'revisionTag':    JSON.stringify(git('tag')),
        'revisionLong':   JSON.stringify(git('long')),
        'revisionShort':  JSON.stringify(git('short')),
        'revisionBranch': JSON.stringify(git('branch')),
      },
      'OUC.licenses': licenses.toString(),
    }),
    new BannerPlugin({
      'raw':       true,
      'entryOnly': false,
      'banner':    "require('source-map-support/register')",
    }),
    new FriendlyErrorsWebpackPlugin({
      'clearConsole': process.env.NODE_ENV === 'development',
    }),
    new NoEmitOnErrorsPlugin(),
    new HotModuleReplacementPlugin(),
  ],
  'module': {
    'rules': [
      {
        'test':   /\.json$/,
        'loader': require.resolve('json-loader'),
      },
      {
        'test':    /\.(js|jsx)$/,
        'loader':  require.resolve('babel-loader'),
        'exclude': [
          /node_modules/,
          path.resolve('./build'),
        ],
        'options': {
          'babelrc':        true,
          'cacheDirectory': true,
          'presets':        [
            [
              'env',
              {
                'targets': {
                  'node': 'current',
                },
                'modules': false,
              },
            ],
          ],
          'plugins': [
            'transform-class-properties',

            [
              'transform-object-rest-spread',
              {
                'useBuiltIns': true,
              },
            ],

            [
              'transform-regenerator',
              {
                'async': false,
              },
            ],

            [
              'transform-runtime',
              {
                'helpers':     false,
                'polyfill':    false,
                'regenerator': true,
                'moduleName':  path.dirname(require.resolve('babel-runtime/package')),
              },
            ],
          ],
        },
      },
    ],
  },
}
