module.exports = {
  'extends': require.resolve('./webpack.base.config'),
  'name':    'api',
  'entry':   {
    'api': './api/entry.js',
  },
}
