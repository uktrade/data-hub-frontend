require('dotenv').config()

const path = require('path')
const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const flash = require('connect-flash')
const csrf = require('csurf')

const enforce = require('express-sslify')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const minifyHTML = require('express-minify-html-2')
const Joi = require('joi')

const config = require('./config')
const title = require('./middleware/title')
const breadcrumbs = require('./middleware/breadcrumbs')
const currentJourney = require('./modules/form/current-journey')
const nunjucks = require('./config/nunjucks')
const headers = require('./middleware/headers')
const locals = require('./middleware/locals')
const { userLocals } = require('./middleware/user-locals')
const user = require('./middleware/user')
const auth = require('./middleware/auth')
const store = require('./middleware/store')
const csrfToken = require('./middleware/csrf-token')
const reactGlobalProps = require('./middleware/react-global-props')
const errors = require('./middleware/errors')
const { sessionStore } = require('./middleware/session-store')
const ssoBypass = require('./middleware/sso-bypass')
const logger = require('./config/logger')
const httpLogger = require('./config/httpLogger')
const basicAuth = require('./middleware/basic-auth')
const features = require('./middleware/features')
const redisCheck = require('./middleware/redis-check')
const reporter = require('./lib/reporter')
const permissions = require('./middleware/permissions')
const envSchema = require('./config/envSchema')
const flashWithBody = require('./middleware/flash-with-body')
const apiProxy = require('./middleware/api-proxy')
const metadataApiProxy = require('./middleware/metadata-api-proxy')
const helpCentreApiProxy = require('./middleware/help-centre-api-proxy')
const fixSlashes = require('./middleware/fix-slashes')

const routers = require('./apps/routers')
const exportWinsReview = require('./apps/__export-wins-review')

const app = express()

// Headers slow down functional tests tremendously and they make no difference in tests
if (!config.isTest) {
  app.use(headers)
}

if (config.isDev) {
  require('./middleware/hmr')(app)
}

if (global.__coverage__) {
  require('@cypress/code-coverage/middleware/express')(app)
}

// Validate ENV vars
Joi.assert(process.env, envSchema, {
  allowUnknown: true,
  abortEarly: false,
})

app.disable('x-powered-by')

if (!config.ci) {
  app.use(httpLogger)
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
app.use(path.join('/', config.assetPath), express.static(config.buildDir))
app.use(
  '/assets',
  express.static(
    path.join(config.root, 'node_modules/govuk-frontend/dist/govuk/assets')
  )
)

app.use(locals)

metadataApiProxy(app)

exportWinsReview(app)

app.use(title())
app.use(breadcrumbs.init())
app.use(breadcrumbs.setHome())

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
app.use(store())
apiProxy(app)
helpCentreApiProxy(app)
// csrf middleware needs to come after the proxy path as it is not needed for the proxy and would block requests
app.use(csrf())
app.use(csrfToken())
app.use(reactGlobalProps())
// routing
app.use(fixSlashes())
app.use(routers)

reporter.setup(app)

app.use(errors.notFound)
app.use(errors.badRequest)
app.use(errors.catchAll)

app.listen(config.port, () => {
  logger.info(`app listening on port ${config.port}`, {
    eventType: logger.eventTypes.expressStartup,
  })
})
