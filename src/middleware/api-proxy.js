const proxy = require('http-proxy-middleware')

const config = require('../config/')

const API_PROXY_PATH = '/api-proxy'
const WHITELIST = [
  '/v4/company-list',
  '/v4/company-list/:id/item',
  '/v4/search/export-country-history',
  '/v4/company-referral/',
  '/v4/company-referral/:id',
  '/v4/company-referral/:id/complete',
  '/adviser/',
  '/v4/company/:id/export-win',
  '/v4/company/:id',
  '/v3/interaction',
]

module.exports = (app) => {
  app.use(
    WHITELIST.map((apiPath) => API_PROXY_PATH + apiPath),
    proxy('/', {
      changeOrigin: true,
      target: config.apiRoot,
      pathRewrite: {
        ['^' + API_PROXY_PATH]: '',
      },
      onProxyReq: (proxyReq, req) => {
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
      onProxyRes: (proxyRes, req, res) => {
        // TODO: Enriching proxy responses should be done through a generic mechanism
        // this will quickly become unscalable as-is
        const isInteractionCreate = (
          proxyRes.req.path == '/v3/interaction' &&
          proxyRes.statusCode == 201 && 
          proxyRes.req.method == 'POST'
        )
        if (isInteractionCreate) {
          req.flash('success', 'Interaction added to Data Hub')
        }
      },
    })
  )
}
