const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const isProd = process.env.NODE_ENV === 'production'
const root = path.normalize(`${__dirname}/..`)

const config = {
  root,
  buildDir: path.join(root, '.build'),
  env: process.env.NODE_ENV,
  ci: process.env.CI,
  isDev,
  isProd,
  port: process.env.PORT || 3000,
  apiRoot: process.env.API_ROOT || 'http://localhost:8000',
  api: {
    authUrl: '/token/',
  },
  postcodeLookup: {
    apiKey: process.env.POSTCODE_KEY,
    baseUrl: 'https://api.getAddress.io/v2/uk/{postcode}?api-key={api-key}',
  },
  redis: {
    url: process.env.REDIS_URL || process.env.REDISTOGO_URL,
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'redis',
    metadataTtl: (process.env.METADATA_TTL || (15 * 60)),
    useTLS: process.env.REDIS_USE_TLS,
  },
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  session: {
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    // 2 hour timeout
    ttl: process.env.SESSION_TTL || (2 * 60 * 60 * 1000),
  },
  assetsHost: process.env.ASSETS_HOST,
  logLevel: process.env.LOG_LEVEL || (isDev ? 'debug' : 'error'),
  zenUrl: `https://${process.env.ZEN_DOMAIN}.zendesk.com/api/v2/tickets.json`,
  zenToken: process.env.ZEN_TOKEN,
  zenEmail: process.env.ZEN_EMAIL,
  zenBrowser: process.env.ZEN_BROWSER,
  zenImpact: process.env.ZEN_IMPACT,
  zenService: process.env.ZEN_SERVICE,
  zenServiceChannel: process.env.ZEN_SERVICE_CHANNEL || 'datahub',
  sentryDsn: process.env.SENTRY_DSN,
  currencyFormat: '$0,0.00',
  longDateFormat: 'D MMMM YYYY',
  mediumDateFormat: 'D MMM YYYY',
  mediumDateTimeFormat: 'D MMM YYYY, h:mma',
  paginationMaxResults: 10000,
  performanceDashboardsUrl: process.env.PERFORMANCE_DASHBOARDS_URL || 'https://mi.exportwins.service.trade.gov.uk',
  archivedDocumentsBaseUrl: process.env.ARCHIVED_DOCUMENTS_BASE_URL,
  oauth: {
    url: process.env.OAUTH2_AUTH_URL,
    clientId: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    redirectUri: process.env.OAUTH2_REDIRECT_URL,
    tokenFetchUrl: process.env.OAUTH2_TOKEN_FETCH_URL,
    token: process.env.OAUTH2_DEV_TOKEN,
  },
}

module.exports = config
