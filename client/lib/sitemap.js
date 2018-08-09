import {createSitemap,} from 'sitemap'
import staticConfig from 'lib/config'
import moment from 'moment'
import {XmlEntities,} from 'html-entities'

// import User from '../../api/connector/schema/user'
import db from '../../api/connector'

const {encode,} = new XmlEntities()
let collections = null

const init = async () => {
  collections = await db()
}

export default async (req, res, next) => {
  if (!collections) {
    return false
  }

  const config = await staticConfig()
  const {User, Theme,} = collections

  let prefix = 'https://'

  if (process.env.NODE_ENV === 'development') {
    prefix = 'http://'
  }

  const sitemap = createSitemap({
    'hostname':    `${prefix}${config.get('domain')}`,
    // Ten minutes cache time
    'cacheTime':   600000,
    'sitemapName': 'main-sitemap',
    'xslUrl':      '/sitemap-theme.xsl',
    'urls':        [
      {
        'url':        '/',
        'changefreq': 'daily',
        'priority':   1,
      },
      {
        'url':        '/contact',
        'changefreq': 'monthly',
        'priority':   0.9,
      },
      {
        'url':        '/help',
        'changefreq': 'monthly',
        'priority':   0.9,
      },
      {
        'url':        '/login',
        'changefreq': 'monthly',
        'priority':   0.9,
      },
      {
        'url':        '/register',
        'changefreq': 'monthly',
        'priority':   0.9,
      },
      {
        'url':        '/notice',
        'changefreq': 'monthly',
        'priority':   0.9,
      },
    ],
  })

  const [users, themes,] = await Promise.all([
    User.find({}, {
      'limit': 100,
      'sort':  '-createdAt',
    }),
    Theme.find({}, {
      'limit': 200,
      'sort':  '-lastUpdate',
    }),
  ])

  users.forEach((user) => {
    sitemap.add({
      'url':        encode(`/profile/${user._id}`),
      'changefreq': 'monthly',
      'lastmodISO': moment(user.lastUpdate).toISOString(),
      'priority':   0.6,
      'img':        [
        {
          'url':     user.avatarUrl,
          'caption': encode(`${user.displayname}'s avatar`),
          'title':   encode(user.displayname),
        },
      ],
    })
  })

  themes.forEach((theme) => {
    const entry = {
      'url':        encode(`/theme/${theme._id}`),
      'changefreq': 'weekly',
      'lastmodISO': moment(theme.lastUpdate).toISOString(),
      'priority':   0.8,
      'img':        [],
    }

    theme.screenshots.forEach((screenshot) => {
      entry.img.push({
        'url':     encode(`https://imageproxy.openusercss.org/${screenshot}`),
        'caption': encode(`Screenshot of ${theme.title}`),
        'title':   encode(theme.title),
      })
    })

    sitemap.add(entry)
  })

  res.set('Content-Type', 'application/xml')
  return res.send(sitemap.toString())
}

init()
