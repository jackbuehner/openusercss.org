/* eslint no-console:0 no-process-env:0 */
const requireDir = require('require-dir')

if (!process.env.NODE_ENV) {
  throw new Error('No NODE_ENV environment variable')
}

requireDir('./tasks/', {
  'recurse': true,
})
