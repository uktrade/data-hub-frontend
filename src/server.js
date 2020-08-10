require('dotenv').config()

require('elastic-apm-node').start()

const path = require('path')
const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const flash = require('connect-flash')
const csrf = require('csurf')
const slashify = require('slashify')
const churchill = require('churchill')
const enforce = require('express-sslify')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const minifyHTML = require('express-minify-html')
const Joi = require('@hapi/joi')

const config = require('./config')
const title = require('./middleware/title')
const breadcrumbs = require('./middleware/breadcrumbs')
const currentJourney = require('./modules/form/current-journey')
const nunjucks = require('./config/nunjucks')
const headers = require('./middleware/headers')
const locals = require('./middleware/locals')
const userLocals = require('./middleware/user-locals')
const metadata = require('./lib/metadata')
const user = require('./middleware/user')
const auth = require('./middleware/auth')
const store = require('./middleware/store')
const csrfToken = require('./middleware/csrf-token')
const reactGlobalProps = require('./middleware/react-global-props')
const errors = require('./middleware/errors')
const sessionStore = require('./middleware/session-store')
const ssoBypass = require('./middleware/sso-bypass')
const logger = require('./config/logger')
const basicAuth = require('./middleware/basic-auth')
const features = require('./middleware/features')
const redisCheck = require('./middleware/redis-check')
const reporter = require('./lib/reporter')
const permissions = require('./middleware/permissions')
const envSchema = require('./config/envSchema')
const flashWithBody = require('./middleware/flash-with-body')
const apiProxy = require('./middleware/api-proxy')

const routers = require('./apps/routers')

const app = express()

if (global.__coverage__) {
  require('@cypress/code-coverage/middleware/express')(app)
}

// Validate ENV vars
Joi.assert(process.env, envSchema, {
  allowUnknown: true,
  abortEarly: false,
})

app.disable('x-powered-by')

// Raven request handler must be the first middleware
reporter.setup(app)

if (!config.ci) {
  app.use(churchill(logger))
}

if (config.forceHttps) {
  app.enable('trust proxy')
  app.use(
    enforce.HTTPS({
      trustProtoHeader: true,
    })
  )
}

app.use(cookieParser())
app.use(compression())

app.set('view engine', 'njk')
nunjucks(app, config)

app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseInlineTagWhitespace: false,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
)

// Static files
app.use(favicon(path.join(config.root, 'public/images', 'favicon.ico')))
app.use(express.static(path.join(config.root, 'public')))
app.use('/js', express.static(path.join(config.buildDir, 'js')))
app.use('/css', express.static(path.join(config.buildDir, 'css')))
app.use('/images', express.static(path.join(config.buildDir, 'images')))
app.use('/fonts', express.static(path.join(config.buildDir, 'fonts')))
app.use(
  '/assets',
  express.static(path.join(config.root, 'node_modules/govuk-frontend/assets'))
)

app.use(title())
app.use(breadcrumbs.init())
app.use(breadcrumbs.setHome())
app.use(locals)
app.use(redisCheck)

app.use(sessionStore)

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(bodyParser.json())

app.use(currentJourney())

app.use(flash())
app.use(flashWithBody)
app.use(ssoBypass())
app.use(basicAuth)
app.use(auth)
app.use(user)
app.use(permissions)
app.use(features)
app.use(userLocals)
app.use(headers)
app.use(store())
apiProxy(app)
// csrf middleware needs to come after the proxy path as it is not needed for the proxy and would block requests
app.use(csrf())
app.use(csrfToken())
app.use(reactGlobalProps())
// routing
app.use(slashify())
app.use(routers)

// Raven error handler must come before other error middleware
reporter.handleErrors(app)

app.use(errors.notFound)
app.use(errors.catchAll)

metadata.fetchAll((errors) => {
  if (errors) {
    logger.log(
      'error',
      'Unable to load all metadataRepository, cannot start app'
    )

    for (const err of errors) {
      throw err
    }
  } else {
    app.listen(config.port, () => {
      logger.log('info', 'app listening on port %s', config.port)
    })
  }
})
