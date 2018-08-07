const rucksack = require('rucksack-css')
const fixes = require('postcss-fixes')
const willChange = require('postcss-will-change')
const willChangeTransition = require('postcss-will-change-transition')
const ellipsis = require('postcss-ellipsis')

const cssnano = require('cssnano')
const advancedPreset = require('cssnano-preset-advanced')

const customPreset = advancedPreset({
  'discardComments':     false,
  'normalizeWhitespace': false,
})

const postCssPluginsFunctional = module.exports.postCssPluginsFunctional = [
  // Syntax extending plugins
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false,
  }),
  ellipsis(),
  // Zero-effort feature adding plugins
  willChange(),
  willChangeTransition(),
]

module.exports.postCssPluginsProdComponents = [
  ...postCssPluginsFunctional,
  fixes(),
  cssnano({
    'preset': customPreset,
  }),
]

module.exports.postCssPluginsProd = [
  ...postCssPluginsFunctional,
  fixes(),
  cssnano({
    'preset': 'advanced',
  }),
]

const iconSizesPx = module.exports.iconSizesPx = [
  16,
  32,
  64,
  128,
]

const bgSizesPx = module.exports.bgSizesPx = [
  1366,
  1920,
  640,
  360,
  128,
]

const elementSizesPx = module.exports.elementSizesPx = [
  128,
  360,
  640,
  960,
  1366,
  1920,
]

const sizes = []

elementSizesPx.forEach((width) => {
  sizes.push({
    'suffix':  `x${width}`,
    'upscale': false,
    width,
  })
})

const iconSizes = []

iconSizesPx.forEach((iconSize) => {
  iconSizes.push({
    'suffix':  `x${iconSize}`,
    'width':   iconSize,
    'upscale': false,
  })
})

const bgSizes = []

bgSizesPx.forEach((bgSize) => {
  bgSizes.push({
    'suffix':  `x${bgSize}`,
    'width':   bgSize,
    'upscale': false,
  })
})

module.exports = Object.assign({}, {
  sizes,
  iconSizes,
  bgSizes,
}, module.exports)
