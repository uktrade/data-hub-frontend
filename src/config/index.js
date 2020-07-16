/**
 * @file Configuration. Do not include within client side code.
 */

const path = require('path')

const envSchema = require('./envSchema')

const { value: envVars } = envSchema.validate(process.env, {
  allowUnknown: true,
  abortEarly: false,
})

const isDev = envVars.NODE_ENV === 'development'
const isProd = envVars.NODE_ENV === 'production'
const isTest = envVars.NODE_ENV === 'test'

const root = path.normalize(`${__dirname}/../..`)

const buildRedisConfig = () => {
  const vcap = envVars.VCAP_SERVICES

  if (vcap && vcap.hasOwnProperty('redis')) {
    return {
      metadataTtl: envVars.METADATA_TTL,
      url: vcap.redis[0].credentials.uri,
      port: vcap.redis[0].credentials.port,
      host: vcap.redis[0].credentials.host,
      useTLS: vcap.redis[0].credentials.tls_enabled,
    }
  }

  return {
    metadataTtl: envVars.METADATA_TTL,
    url: envVars.REDIS_URL || envVars.REDISTOGO_URL,
    port: envVars.REDIS_PORT,
    host: envVars.REDIS_HOST,
    useTLS: envVars.REDIS_USE_TLS,
  }
}

const config = {
  root,
  buildDir: path.join(root, '.build'),
  env: envVars.NODE_ENV,
  ci: envVars.CI,
  forceHttps: envVars.FORCE_HTTPS,
  isDev,
  isProd,
  isTest,
  version: envVars.GIT_BRANCH,
  noCache: envVars.CACHE_ASSETS ? false : isDev,
  port: envVars.PORT,
  accountPlanUrls: envVars.ACCOUNT_PLAN_URLS,
  apiRoot: envVars.API_ROOT,
  api: {
    authUrl: '/token/',
  },
  postcodeLookup: {
    apiKey: envVars.POSTCODE_KEY,
    baseUrl: envVars.DATA_STORE_SERVICE_POSTCODE,
  },
  regionLookupUrl: envVars.DATA_STORE_SERVICE_POSTCODE_TO_REGION_URL,
  redis: buildRedisConfig(),
  proxy: envVars.PROXY,
  cacheDurationShort: envVars.CACHE_DURATION_SHORT,
  cacheDurationLong: envVars.CACHE_DURATION_LONG,
  googleTagManagerKey: envVars.GOOGLE_TAG_MANAGER_KEY,
  session: {
    secret: envVars.SESSION_SECRET,
    ttl: envVars.SESSION_TTL,
  },
  logLevel: envVars.LOG_LEVEL,
  logResponses: envVars.LOG_RESPONSES,
  logRequests: envVars.LOG_REQUESTS,
  zen: {
    ticketsURL: envVars.ZEN_TICKETS_URL,
    token: envVars.ZEN_TOKEN,
    email: envVars.ZEN_EMAIL,
    browser: envVars.ZEN_BROWSER,
    service: envVars.ZEN_SERVICE,
    serviceChannel: envVars.ZEN_SERVICE_CHANNEL,
  },
  sentryDsn: envVars.SENTRY_DSN,
  sentryEnvironment: envVars.SENTRY_ENVIRONMENT,
  currencyFormat: '$0,0.00',
  paginationMaxResults: 10000,
  paginationDefaultSize: 10,
  performanceDashboardsUrl: envVars.PERFORMANCE_DASHBOARDS_URL,
  findExportersUrl: envVars.FIND_EXPORTERS_URL,
  archivedDocumentsBaseUrl: envVars.ARCHIVED_DOCUMENTS_BASE_URL,
  oauth: {
    url: envVars.OAUTH2_AUTH_URL,
    clientId: envVars.OAUTH2_CLIENT_ID,
    clientSecret: envVars.OAUTH2_CLIENT_SECRET,
    redirectUri: envVars.OAUTH2_REDIRECT_URL,
    tokenFetchUrl: envVars.OAUTH2_TOKEN_FETCH_URL,
    userProfileUrl: envVars.OAUTH2_USER_PROFILE_URL,
    logoutUrl: envVars.OAUTH2_LOGOUT_URL,
    devToken: envVars.OAUTH2_DEV_TOKEN,
    bypassSSO: envVars.OAUTH2_BYPASS_SSO,
  },
  basicAuth: {
    user: envVars.BASIC_AUTH_USER,
    password: envVars.BASIC_AUTH_PASSWORD,
  },
  hawkCredentials: {
    dataHubBackend: {
      id: envVars.DATA_HUB_BACKEND_ACCESS_KEY_ID,
      key: envVars.DATA_HUB_BACKEND_SECRET_ACCESS_KEY,
      algorithm: 'sha256',
    },
    dataStoreService: {
      id: envVars.DATA_STORE_SERVICE_ACCESS_KEY_ID,
      key: envVars.DATA_STORE_SERVICE_SECRET_ACCESS_KEY,
      algorithm: 'sha256',
    },
  },
  oneList: {
    email: envVars.ONE_LIST_EMAIL,
  },
  activityFeed: {
    paginationSize: 20,
  },
  helpCentre: {
    url: envVars.HELP_CENTRE_URL,
    announcementsURL: envVars.HELP_CENTRE_ANNOUNCMENTS_URL,
    apiFeed: envVars.HELP_CENTRE_API_FEED,
    token: envVars.HELP_CENTRE_FEED_API_TOKEN,
  },
  companies: {
    tierTypes: {
      typeD: {
        itaAccount: '1929c808-99b4-4abf-a891-45f2e187b410',
      },
    },
  },
  greatProfileUrl: envVars.GREAT_PROFILE_URL,
}

module.exports = config
