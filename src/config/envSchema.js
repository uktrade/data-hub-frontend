const Joi = require('@hapi/joi')

const ExtendedJoi = Joi.extend((joi) => ({
  type: 'json',
  base: joi.object(),
  messages: {
    'json.invalid': '"{{#label}}" has invalid JSON format',
  },
  coerce(value, helpers) {
    try {
      return { value: JSON.parse(value) }
    } catch (ignoreErr) {
      return { value, errors: helpers.error('json.invalid') }
    }
  },
}))

/* eslint-disable prettier/prettier */
const OAUTH2_STR = Joi.string()
  .when('OAUTH2_BYPASS_SSO', { is: false, then: Joi.required() })
const OAUTH2_URI = Joi.string().uri()
  .when('OAUTH2_BYPASS_SSO', { is: false, then: Joi.required() })

const envSchema = Joi.object({
  // A mapping of { duns_number: url, .. } for the companies that have account plans
  ACCOUNT_PLAN_URLS: ExtendedJoi.json().default({}),

  // The url for a back end server instance for the service
  API_ROOT: Joi.string().uri().required(),

  // The url for the archived documents store
  ARCHIVED_DOCUMENTS_BASE_URL: Joi.string().uri().required(),

  // If running a server with OAUTH2_BYPASS_SSO=true then this can be used in
  // conjunction with a password to setup basic HTTP auth to protect the server
  BASIC_AUTH_USER: Joi.string(),
  // Used in conjunction with BASIC_AUTH_USER to setup security for the server
  BASIC_AUTH_PASSWORD: Joi.string(),

  // Turn on caching for Nunjucks templates
  CACHE_ASSETS: Joi.bool(),
  // Long term cache duration, usually used to store metadata
  CACHE_DURATION_LONG: Joi.number().integer().default(1000),
  // Short term cache duration
  CACHE_DURATION_SHORT: Joi.number().integer().default(100),

  // Set to true for UAT testing, otherwise ignore
  CI: Joi.bool(),

  // Identifier of a Hawk key required to access the backend metadata endpoints
  DATA_HUB_BACKEND_ACCESS_KEY_ID: Joi.string().required(),
  // Secret Hawk key required to access the backend metadata endpoints
  DATA_HUB_BACKEND_SECRET_ACCESS_KEY: Joi.string().required(),

  // Data store service API Hawk Auth ID
  DATA_STORE_SERVICE_ACCESS_KEY_ID: Joi.string().required(),
  // Data store service API Hawk Auth key
  DATA_STORE_SERVICE_SECRET_ACCESS_KEY: Joi.string().required(),
  // Data store service for postcode lookup
  DATA_STORE_SERVICE_POSTCODE: Joi.string().required(),
  // Data store service API endpoint
  DATA_STORE_SERVICE_POSTCODE_TO_REGION_URL: Joi.string().required(),

  // Url to Find Exporters app
  FIND_EXPORTERS_URL: Joi.string().uri().required(),

  // Force using an HTTPS connection
  FORCE_HTTPS: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.bool().default(true),
    otherwise: Joi.bool().default(false),
  }),

  // Current version of the app which contains a Git tag.
  // See https://github.com/uktrade/ci-pipeline/blob/master/Jenkinsfile#L299
  GIT_BRANCH: Joi.string().default('unknown'),

  // The key needed to integrate with Google Tag Manager to track usage
  GOOGLE_TAG_MANAGER_KEY: Joi.string(),

  // Help centre announcements url
  HELP_CENTRE_ANNOUNCMENTS_URL: Joi.string().uri().required(),
  // Help centre feed API url
  HELP_CENTRE_API_FEED: Joi.string().uri().required(),
  // Help centre API token
  HELP_CENTRE_FEED_API_TOKEN: Joi.string().required(),
  // Help centre url
  HELP_CENTRE_URL: Joi.string().uri().required(),

  // How much logging to output
  LOG_LEVEL: Joi.string()
    .valid('emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug')
    .default('error'),
  LOG_REQUESTS: Joi.bool(),
  LOG_RESPONSES: Joi.bool(),

  // How long to store dropdown data etc for, in seconds. Defaults to 15 minutes
  METADATA_TTL: Joi.number().integer().default(15 * 60),

  // Whether to run the app in dev mode. Set to `production` in production, otherwise don't set for dev behaviour
  NODE_ENV: Joi.string().valid('production', 'development', 'test')
    .default('production'),

  // If a developer wishes to bypass OAuth locally then set this to true
  OAUTH2_BYPASS_SSO: Joi.bool().default(false),
  // Token used for working with OAuth locally whilst developing. This token is
  // also used with CircleCi for providing user with different permissions.
  // Used only when OAUTH2_BYPASS_SSO is TRUE
  OAUTH2_DEV_TOKEN: Joi.string().when('OAUTH2_BYPASS_SSO', { is: true, then: Joi.required() }),
  // OAuth auth url
  OAUTH2_AUTH_URL: OAUTH2_STR,
  // OAuth client ID
  OAUTH2_CLIENT_ID: OAUTH2_STR,
  // OAuth client secret
  OAUTH2_CLIENT_SECRET: OAUTH2_STR,
  // Location where user will be redirected to after logging out
  OAUTH2_LOGOUT_URL: OAUTH2_URI,
  // OAuth callback url
  OAUTH2_REDIRECT_URL: OAUTH2_URI,
  // OAuth fetch token url
  OAUTH2_TOKEN_FETCH_URL: OAUTH2_URI,
  // OAuth user profile url
  OAUTH2_USER_PROFILE_URL: OAUTH2_URI,

  // Email address to the team responsible for changes to the One List companies
  ONE_LIST_EMAIL: Joi.string().required(),

  // Url to Export Wins performance dashboards, used in the main nav
  PERFORMANCE_DASHBOARDS_URL: Joi.string().uri().required(),

  // Port on which the app runs
  PORT: Joi.number().port().default(3000),

  // Token used for address search from https://getaddress.io/
  POSTCODE_KEY: Joi.string().required(),

  // URL of a proxy to use to contact the API through. Useful for debugging
  PROXY: Joi.string().uri(),

  // You need to run redis and provide the host name for it here unless you
  // specify the entire url
  REDIS_HOST: Joi.string().alphanum().default('redis'),
  // Redis port
  REDIS_PORT: Joi.number().port().default(6379),
  // A full length url to connect to redis
  REDIS_URL: Joi.string().uri(),
  // Whether Redis is proxied through stunnel or not
  REDIS_USE_TLS: Joi.bool(),

  // Sentry DSN
  SENTRY_DSN: Joi.string().uri(),
  // Environment name used by Sentry
  SENTRY_ENVIRONMENT: Joi.string(),

  // String to encrypt session data with
  SESSION_SECRET: Joi.string().required(),
  // How long the user session lasts, in millis. Defaults to 2 hours
  SESSION_TTL: Joi.number().integer().default(2 * 60 * 60 * 1000),

  // Configuration object (JSON) of Cloud Foundry services
  VCAP_SERVICES: ExtendedJoi.json().default({}),

  // Zendesk field ID used to capture user's browser
  ZEN_BROWSER: Joi.string(),
  // Zendesk username used for API queries
  ZEN_EMAIL: Joi.string().required(),
  // Zendesk field ID used to service
  ZEN_SERVICE: Joi.string(),
  // Zendesk field value for service field
  ZEN_SERVICE_CHANNEL: Joi.string().default('datahub'),
  // Zendesk endpoint used to create support tickets
  ZEN_TICKETS_URL: Joi.string().uri().required(),
  // Zendesk token used for API queries
  ZEN_TOKEN: Joi.string().required(),

  // Elastic APM service name used to label the service you want to monitor
  ELASTIC_APM_SERVICE_NAME: Joi.string().default('datahub-fe'),
  // Elastic APM server url is where you host the monitoring of transactions
  ELASTIC_APM_SERVER_URL: Joi.string().uri().required(),
  // Elastic APM secret token used to authenticate the service
  ELASTIC_APM_SECRET_TOKEN: Joi.string().required(),
  // Elastic APM server timeout used to timeout if no response is found after 20 secs
  ELASTIC_APM_SERVER_TIMEOUT: Joi.number().integer().default(20)
})
/* eslint-enable prettier/prettier */

module.exports = envSchema
