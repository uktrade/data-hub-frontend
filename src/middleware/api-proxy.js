const { legacyCreateProxyMiddleware } = require('http-proxy-middleware')

const config = require('../config')
const getZipkinHeaders = require('../lib/get-zipkin-headers')

const HTTP_GET = 'GET'
const API_PROXY_PATH = '/api-proxy'
const ALLOWLIST = [
  '/v3/interaction',
  '/v4/interaction',
  '/v3/investment',
  '/v3/investment/:id',
  '/v3/investment/:id/update-stage',
  '/whoami/',
  '/v4/adviser/:id/investment-summary',
  '/v4/company-list',
  '/v4/company-list/:id/item',
  '/v4/search/export-country-history',
  '/v4/company-referral/',
  '/v4/company-referral/:id',
  '/v4/company-referral/:id/complete',
  '/adviser/',
  '/adviser/:id/',
  '/v4/company/:id/export-win',
  '/v4/company/:id',
  '/v4/company/:id/assign-one-list-tier-and-global-account-manager',
  '/v4/reminder/subscription/summary',
  '/v4/reminder/estimated-land-date',
  '/v4/reminder/no-recent-export-interaction',
  '/v4/reminder/no-recent-investment-interaction',
  '/v4/reminder/new-export-interaction',
  '/v4/reminder/my-tasks-due-date-approaching',
  '/v4/reminder/my-tasks-task-assigned-to-me-from-others',
  '/v4/reminder/my-tasks-task-amended-by-others',
  '/v4/reminder/my-tasks-task-overdue',
  '/v4/reminder/my-tasks-task-completed',
  '/v4/company/:id/remove-from-one-list',
  '/v4/company/:id/update-one-list-core-team',
  '/v4/proposition',
  '/v3/contact',
  '/v4/contact',
  '/v4/contact/:id',
  '/v3/search/contact',
  '/v4/company',
  '/v4/company/:id/assign-regional-account-manager',
  '/v4/dnb/company-change-request',
  '/v4/large-investor-profile',
  '/v4/large-investor-profile/:id',
  '/v4/search/company-activity',
  '/v3/search/investment_project',
  '/v4/search/large-investor-profile',
  '/v4/large-capital-opportunity/:id',
  '/v4/large-capital-opportunity',
  '/v4/search/company',
  '/v4/search/large-capital-opportunity',
  '/v3/search/interaction',
  '/v3/search/event',
  '/v3/search/order',
  '/v3/event/',
  '/v4/event/',
  '/v4/export-win/',
  '/v4/export-win/:exportWinId',
  '/v4/event/:id',
  '/v3/omis/order/:id/assignee',
  '/v3/omis/order/:id/subscriber-list',
  '/v3/investment/:id/team-member',
  '/v3/contact/:id/archive',
  '/v4/reminder/summary',
  '/v3/contact/:id/audit',
  '/v4/interaction/:id',
  '/v4/interaction/:id/archive',
  '/v4/export',
  '/v4/export/:exportId',
  '/v4/dnb/:companyId/family-tree',
  '/v4/search/adviser',
  '/v4/dnb/:companyId/related-companies/count',
  '/v3/omis/order/:id',
  '/v4/task/:id',
  '/v4/task',
  '/v3/omis/order/:id/invoice',
  '/v4/reminder/subscription/:reminderType',
  '/v3/omis/order/:id/complete',
  '/v3/omis/order',
  '/v4/search/task',
  '/v4/task/companies-and-projects',
  '/v3/omis/order/:id/quote',
  '/v3/omis/order/:id/quote/preview',
  '/v3/omis/order/:id/quote/cancel',
  '/v3/investment/:projectId/proposition/:propositionId/document',
  '/v3/investment/:projectId/proposition/:propositionId/document/upload-callback',
  '/v4/investment-lead/eyb/:eybLeadId',
  '/v4/investment-lead/eyb',
  '/v4/investment-lead/eyb/:eybLeadId/audit',
  '/v4/dnb/company-investigation',
  '/v4/company-activity/stova-events/:id',
  '/v4/document',
]

module.exports = (app) => {
  app.use(
    ALLOWLIST.map((apiPath) => API_PROXY_PATH + apiPath),
    legacyCreateProxyMiddleware('/', {
      changeOrigin: true,
      target: config.apiRoot,
      pathRewrite: {
        ['^' + API_PROXY_PATH]: '',
      },
      onProxyReq: (proxyReq, req) => {
        Object.entries(getZipkinHeaders(req)).forEach(
          ([header, headerValue]) => {
            proxyReq.setHeader(header, headerValue)
          }
        )

        // We have a problem in that Axios GET requests include an empty body that's sent to the server.
        // The request body should not be included because GET requests do not have a body by HTTP specification.
        // The AWS docs say that "if a viewer GET request includes a body, CloudFront returns an HTTP status code 403 (Forbidden) to the viewer".
        // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#RequestCustom-get-body
        if (req.method === HTTP_GET && req.body) {
          // Prevent the 403
          req.body = null
        }

        proxyReq.setHeader('authorization', `Bearer ${req.session.token}`)
        // this is required to be able to handle POST requests and avoid a conflict with bodyParser
        // issue here -> https://github.com/chimurai/http-proxy-middleware/issues/320
        if (req.body) {
          let bodyData = JSON.stringify(req.body)
          // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
          proxyReq.setHeader('Content-Type', 'application/json')
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
          // stream the content
          proxyReq.write(bodyData)
        }
      },
    })
  )
}
