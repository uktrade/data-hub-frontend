require('dotenv').config()
const bodyParser = require('body-parser')
const compression = require('compression')
const config = require('./config')
const express = require('express')
const flash = require('connect-flash')
const nunjucks = require('nunjucks')
const redis = require('redis')
const redisCrypto = require('connect-redis-crypto')
const session = require('express-session')
const url = require('url')
const winston = require('winston')

const datahubFlash = require('./middleware/flash')
const filters = require('@uktrade/trade_elements/dist/nunjucks/filters')
const forceHttps = require('./middleware/force-https')
const headers = require('./middleware/headers')
const locals = require('./middleware/locals')
const metadata = require('./repos/metadata.repo')
const user = require('./middleware/user')
const auth = require('./middleware/auth')
const csrf = require('./middleware/csrf')

const apiController = require('./controllers/api.controller')
const contactController = require('./controllers/contact.controller')
const contactEditController = require('./controllers/contact-edit.controller')
const contactInteractionController = require('./controllers/contact-interaction.controller')
const companyInvestmentSummaryController = require('./controllers/company-investment-summary.controller')
const indexController = require('./controllers/index.controller')
const loginController = require('./controllers/login.controller')
const myAccountController = require('./controllers/my-account.controller')
const pingdomController = require('./controllers/pingdom.controller')
const searchController = require('./controllers/search.controller')
const interactionController = require('./controllers/interaction.controller')
const interactionEditController = require('./controllers/interaction-edit.controller')
const serviceDeliveryController = require('./controllers/service-delivery.controller')
const supportController = require('./controllers/support.controller')

const app = express()
app.disable('x-powered-by')
const isDev = app.get('env') === 'development'
winston.level = config.logLevel

const RedisStore = redisCrypto(session)

let client

if (config.redis.url) {
  const redisURL = url.parse(config.redis.url)
  /* eslint-disable camelcase */
  client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true })
  /* eslint-enable camelcase */
  client.auth(redisURL.auth.split(':')[1])
} else {
  client = redis.createClient(config.redis.port, config.redis.host)
}

client.on('error', (e) => {
  winston.log('error', 'Error connecting to redis')
  winston.log('error', e)
  throw e
})

client.on('connect', () => {
  winston.log('info', 'connected to redis')
})

client.on('ready', () => {
  winston.log('info', 'connection to redis is ready to use')
})

const redisStore = new RedisStore({
  client,
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret
})

app.use(session({
  store: redisStore,
  proxy: !isDev,
  cookie: {
    secure: !isDev,
    maxAge: config.session.ttl
  },
  rolling: true,
  key: 'datahub.sid',
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

app.use(compression())

filters.stringify = JSON.stringify

app.set('view engine', 'html')
const nunenv = nunjucks.configure([`${__dirname}/views`, `${__dirname}/../node_modules/@uktrade/trade_elements/dist/nunjucks`], {
  autoescape: true,
  express: app,
  watch: isDev
})

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName])
})

// Static files
app.use('/javascripts', express.static(`${__dirname}/../build/javascripts`))
app.use('/css', express.static(`${__dirname}/../build/css`))
app.use(express.static(`${__dirname}/../src/public`))

app.use('/images', express.static(`${__dirname}/../node_modules/@uktrade/trade_elements/dist/images`))
app.use('/css', express.static(`${__dirname}/../node_modules/@uktrade/trade_elements/dist/css`))
app.use('/javascripts', express.static(`${__dirname}/../node_modules/@uktrade/trade_elements/dist/javascripts`))

app.use('/fonts', express.static(`${__dirname}/../node_modules/font-awesome/fonts`))

app.use(forceHttps)
app.use(flash())
app.use(locals)
app.use(datahubFlash)
app.use(auth)
app.use(user)
app.use(csrf)
app.use(headers)

app.use('/login', loginController.router)
app.use('/myaccount', myAccountController.router)
app.use(require('./controllers/company-ch.controller').router)
app.use(require('./controllers/company-foreign.controller').router)
app.use(require('./controllers/company-ltd.controller').router)
app.use(require('./controllers/company-ukother.controller').router)
app.use(require('./controllers/company-interaction.controller').router)
app.use(require('./controllers/company-contact.controller').router)
app.use(require('./controllers/company-add.controller').router)
app.use(require('./controllers/company-archive.controller').router)
app.use(companyInvestmentSummaryController.router)
app.use(companyInvestmentSummaryController.router)
app.use(contactController.router)
app.use(require('./controllers/contact-archive.controller').router)
app.use(contactEditController.router)
app.use(contactInteractionController.router)
app.use(interactionController.router)
app.use(interactionEditController.router)
app.use(serviceDeliveryController.router)
app.use('/support', supportController.router)

app.use(searchController.router)
app.use(apiController.router)
app.get('/', indexController)
app.use('/ping.xml', pingdomController.get)

metadata.fetchAll((errors) => {
  if (errors) {
    winston.log('error', 'Unable to load all metadataRepository, cannot start app')

    for (const err of errors) {
      throw err
    }
  } else {
    app.listen(config.port, () => {
      winston.log('info', 'app listening on port %s', config.port)
    })
  }
})
