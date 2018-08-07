const gulp = require('gulp')
const pump = require('pump')
const merge = require('merge-stream')
const buffer = require('gulp-buffer')
const filter = require('gulp-filter')
const path = require('path')
const remember = require('gulp-remember')
const cached = require('gulp-cached')

// IMAGES
const imagemin = require('gulp-imagemin')
const jpegRecompress = require('imagemin-jpeg-recompress')
const jimp = require('gulp-jimp-resize')

// SASS
const sass = require('gulp-sass')

// POSTCSS
const postcss = require('gulp-postcss')

// OTHER
const concat = require('gulp-concat')
const flatten = require('gulp-flatten')
const {
  iconSizes,
  bgSizes,
  sizes,
  postCssPluginsProd,
} = require('./shared/css')

const sources = {
  'email': [
    'app/scss/email.scss',
  ],
  'sitemap': [
    'app/scss/sitemap.scss',
  ],
  'emailTemplates': [
    'client/emails/**/*.pug',
    'client/email-views/**/*.pug',
  ],
  'icons': [
    'client/img/*.icon.*',
  ],
  'elements': [
    'client/img/**/*',
  ],
  'backgrounds': [
    'client/img/**/*.bg.*',
  ],
  'vectors': [
    'client/img/**/*.svg',
  ],
  'other': [
    'client/static/**/*',
  ],
}

const filters = {
  'bitmap': [
    '**/*.{png,jpg,jpeg,gif}',
  ],
  'element': [
    '!**/*.{icon|bg}*',
  ],
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./app/static/')
  }

  return path.resolve('./app/static/', dest)
}

gulp.task('static:copy', () => {
  return pump([
    gulp.src(sources.other),
    gulp.dest(destination()),
  ])
})

gulp.task('static:prod', (done) => {
  const iconStream = pump([
    gulp.src(sources.icons),
    filter(filters.bitmap),
    jimp({
      'sizes': iconSizes,
    }),
  ])

  const elementStream = pump([
    gulp.src(sources.elements),
    filter(filters.bitmap),
    jimp({
      sizes,
    }),
  ])

  const backgroundsStream = pump([
    gulp.src(sources.backgrounds),
    filter(filters.bitmap),
    jimp({
      'sizes': bgSizes,
    }),
  ])

  return pump([
    merge(backgroundsStream, iconStream, elementStream, gulp.src(sources.vectors)),
    imagemin([
      imagemin.gifsicle({
        'interlaced':        true,
        'optimizationLevel': 3,
      }),
      jpegRecompress(),
      imagemin.optipng({
        'optimizationLevel': 5,
      }),
      imagemin.svgo({
        'plugins': [
          {
            'removeViewBox': true,
          },
        ],
      }),
    ]),
    flatten(),
    gulp.dest(destination('img')),
  ])
})

gulp.task('static:fast', (done) => {
  const iconStream = pump([
    gulp.src(sources.icons),
    filter(filters.bitmap),
    cached('icons'),
    jimp({
      'sizes': iconSizes,
    }),
  ])

  const elementStream = pump([
    gulp.src(sources.elements),
    filter(filters.bitmap),
    cached('elements'),
    filter([
      '**/*.{png,jpg,jpeg,gif}',
      '!**/*.bg*',
    ]),
    jimp({
      sizes,
    }),
  ])

  const backgroundsStream = pump([
    gulp.src(sources.backgrounds),
    filter(filters.bitmap),
    cached('backgrounds'),
    jimp({
      'sizes': bgSizes,
    }),
  ])

  const vectorStream = pump([
    gulp.src(sources.vectors),
    cached('vectors'),
  ])

  return pump([
    merge(backgroundsStream, iconStream, elementStream, vectorStream),
    flatten(),
    merge(
      remember('icons'),
      remember('elements'),
      remember('backgrounds'),
      remember('vectors'),
    ),
    gulp.dest(destination('img')),
  ])
})

gulp.task('static:email', () => {
  return pump([
    gulp.src(sources.email),
    sass(),
    buffer(),
    concat('email.min.css'),
    postcss(postCssPluginsProd),
    flatten(),
    gulp.dest(destination('css')),
  ])
})

gulp.task('static:sitemap', () => {
  return pump([
    gulp.src(sources.sitemap),
    sass(),
    buffer(),
    concat('sitemap.min.css'),
    postcss(postCssPluginsProd),
    flatten(),
    gulp.dest(destination('css')),
  ])
})

gulp.task('static:email-templates', () => {
  return pump([
    gulp.src(sources.emailTemplates),
    gulp.dest(path.resolve('./build/emails')),
  ])
})

gulp.task('static:watch', () => {
  gulp.watch([
    'client/img/*',
    ...sources.other,
  ], gulp.series('static:fast', 'static:copy'))
  gulp.watch(sources.email, gulp.series('static:email'))
  gulp.watch(sources.sitemap, gulp.series('static:sitemap'))
  gulp.watch([
    'client/email-views/**/*',
    'client/emails/**/*',
  ], gulp.series('static:email-templates'))
})
