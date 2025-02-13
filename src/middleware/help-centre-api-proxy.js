const config = require('../config')
const hawkRequest = require('../lib/hawk-request')
const {
  formatHelpCentreAnnouncements,
} = require('../apps/dashboard/transformers')

const API_PROXY_PATH = '/api-proxy/help-centre/feed'

module.exports = (app) => {
  app.use(API_PROXY_PATH, async (req, res) => {
    try {
      const url = config.helpCentre.apiFeed
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
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // If the help centre is offline, we send an empty feed rather than displaying an error
      res.write(JSON.stringify([]))
      res.send()
    }
  })
}
