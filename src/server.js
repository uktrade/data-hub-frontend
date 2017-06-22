require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser')
const compression = require('compression')
const config = require('../config')
const express = require('express')
const flash = require('connect-flash')
const redis = require('redis')
const redisCrypto = require('connect-redis-crypto')
const session = require('express-session')
const url = require('url')
const csrf = require('csurf')
const slashify = require('slashify')
const churchill = require('churchill')
const enforce = require('express-sslify')
const favicon = require('serve-favicon')

const nunjucks = require('../config/nunjucks')
const datahubFlash = require('./middleware/flash')
const headers = require('./middleware/headers')
const locals = require('./middleware/locals')
const metadata = require('./repos/metadata.repo')
const user = require('./middleware/user')
const auth = require('./middleware/auth')
const csrfToken = require('./middleware/csrf-token')
const errors = require('./middleware/errors')
const logger = require('../config/logger')

const router = require('../config/routes')

const isDev = config.isDev
const app = express()

app.disable('x-powered-by')

if (!config.ci) {
  app.use(churchill(logger))
}

if (!isDev) {
  app.enable('trust proxy')
  app.use(enforce.HTTPS({
    trustProtoHeader: true,
  }))
}

const RedisStore = redisCrypto(session)

let client

if (config.redis.url) {
  const redisURL = url.parse(config.redis.url)
  client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true })
  client.auth(redisURL.auth.split(':')[1])
} else {
  client = redis.createClient(config.redis.port, config.redis.host)
}

client.on('error', (e) => {
  logger.log('error', 'Error connecting to redis')
  logger.log('error', e)
  throw e
})

client.on('connect', () => {
  logger.log('info', 'connected to redis')
})

client.on('ready', () => {
  logger.log('info', 'connection to redis is ready to use')
})

const redisStore = new RedisStore({
  client,
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret,
})

app.use(session({
  store: redisStore,
  proxy: !isDev,
  cookie: {
    secure: !isDev,
    maxAge: config.session.ttl,
  },
  rolling: true,
  key: 'datahub.sid',
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

app.use(csrf())
app.use(csrfToken())

app.use(compression())

app.set('view engine', 'njk')
nunjucks(app, config)

// Static files
app.use(favicon(path.join(config.root, 'src/public/assets/images', 'favicon.ico')))
app.use('/javascripts', express.static(`${__dirname}/../build/javascripts`))
app.use('/css', express.static(`${__dirname}/../build/css`))
app.use(express.static(`${__dirname}/../src/public`))

app.use('/images', express.static(`${__dirname}/../node_modules/@uktrade/trade_elements/dist/images`))
app.use('/css', express.static(`${__dirname}/../node_modules/@uktrade/trade_elements/dist/css`))
app.use('/javascripts', express.static(`${__dirname}/../node_modules/@uktrade/trade_elements/dist/javascripts`))

app.use('/fonts', express.static(`${__dirname}/../node_modules/font-awesome/fonts`))

app.use(flash())
app.use(locals)
app.use(datahubFlash)
app.use(auth)
app.use(user)
app.use(headers)

// routing
app.use(slashify())
app.use('/', router)

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
