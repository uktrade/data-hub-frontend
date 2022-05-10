const config = require('../config')
const hawkRequest = require('../lib/hawk-request')
const {
  formatHelpCentreAnnouncements,
} = require('../apps/dashboard/transformers')

const API_PROXY_PATH = '/api-proxy/help-centre/feed'

module.exports = (app) => {
  app.use(API_PROXY_PATH, async (req, res, next) => {
    try {
      const testParam = req.query.test ? `?test=${req.query.test}` : ''
      const url = `${config.helpCentre.apiFeed}${testParam}`
      const responseData = await hawkRequest(
        url,
        config.hawkCredentials.helpCentre,
        1000
      )
      res.setHeader('Content-Type', 'application/json')
      const { articles } = responseData
      const articleFeed = formatHelpCentreAnnouncements(articles) || []

      res.write(JSON.stringify(articleFeed))
      res.send()
    } catch (error) {
      next(error)
    }
  })
}
