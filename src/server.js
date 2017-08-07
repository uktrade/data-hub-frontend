require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser')
const compression = require('compression')
const config = require('../config')
const express = require('express')
const flash = require('connect-flash')
const csrf = require('csurf')
const slashify = require('slashify')
const churchill = require('churchill')
const enforce = require('express-sslify')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const i18n = require('i18n-future').middleware()

const title = require('./middleware/title')
const breadcrumbs = require('./middleware/breadcrumbs')
const nunjucks = require('../config/nunjucks')
const headers = require('./middleware/headers')
const locals = require('./middleware/locals')
const metadata = require('./lib/metadata')
const user = require('./middleware/user')
const auth = require('./middleware/auth')
const store = require('./middleware/store')
const csrfToken = require('./middleware/csrf-token')
const errors = require('./middleware/errors')
const sessionStore = require('./middleware/session-store')
const logger = require('../config/logger')

const routers = require('./apps/routers')

const app = express()

app.disable('x-powered-by')

if (!config.ci) {
  app.use(churchill(logger))
}

if (!config.isDev) {
  app.enable('trust proxy')
  app.use(enforce.HTTPS({
    trustProtoHeader: true,
  }))
}

app.use(cookieParser())
app.use(sessionStore)

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

app.use(csrf())
app.use(csrfToken())
app.use(compression())
app.use(i18n)

app.set('view engine', 'njk')
nunjucks(app, config)

// Static files
app.use(favicon(path.join(config.root, 'public/images', 'favicon.ico')))
app.use(express.static(path.join(config.root, 'public')))
app.use('/js', express.static(path.join(config.buildDir, 'js')))
app.use('/css', express.static(path.join(config.buildDir, 'css')))
app.use('/images', express.static(path.join(config.buildDir, 'images')))
app.use('/fonts', express.static(path.join(config.buildDir, 'fonts')))

app.use(title())
app.use(breadcrumbs.init())
app.use(breadcrumbs.setHome())

app.use(flash())
app.use(locals)
app.use(auth)
app.use(user)
app.use(headers)
app.use(store())

// routing
app.use(slashify())
app.use(routers)

app.use(errors.notFound)
app.use(errors.catchAll)

metadata.fetchAll((errors) => {
  if (errors) {
    logger.log('error', 'Unable to load all metadataRepository, cannot start app')

    for (const err of errors) {
      throw err
    }
  } else {
    app.listen(config.port, () => {
      logger.log('info', 'app listening on port %s', config.port)
    })
  }
})
