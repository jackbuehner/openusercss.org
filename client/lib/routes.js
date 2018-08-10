import {Nuxt, Builder,} from 'nuxt-edge'
import express from 'express'
import nuxtConfig from '~/nuxt.config'

import sitemapHandler from './sitemap'

const cacheOptions = {
  'extensions': [
    'html',
    'htm',
    'js',
  ],
  'index':  false,
  'maxAge': '14d',
}

export default async ({app, config,}) => {
  let nuxt = new Nuxt({
    'dev':  nuxtConfig.dev,
    'head': nuxtConfig.head,
    'css':  nuxtConfig.css,
  })

  app.use('/sitemap.xml', sitemapHandler)
  app.use(express.static('app/static', cacheOptions))

  if (config.get('env') === 'development') {
    nuxt = new Nuxt(nuxtConfig)
    const builder = new Builder(nuxt)

    builder.build()
  }

  app.use(nuxt.render)
}
