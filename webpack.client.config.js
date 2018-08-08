module.exports = {
  'extends': require.resolve('./webpack.base.config'),
  'name':    'client',
  'entry':   {
    'client': './client/entry.js',
  },
}
