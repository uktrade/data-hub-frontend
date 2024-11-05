const { legacyCreateProxyMiddleware } = require('http-proxy-middleware')

const config = require('../../config')

module.exports = (app) => {
  // We have to specially treat this endpoint as it doesn't require an access token nor
  // any other authorization and we don't want any cookie to be set
  app.use(
    '/api-proxy/v4/export-win/review/',
    legacyCreateProxyMiddleware({
      target: config.apiRoot,
      changeOrigin: true,
      pathRewrite: {
        '^/api-proxy': '',
      },
    })
  )

  app.use((req, res, next) => {
    if (/\/exportwins\/review/.test(req.url)) {
      // This skips all subsequent middleware
      res.render('__export-wins-review/view')
    } else {
      // Continue to the next middleware
      next()
    }
  })
}
