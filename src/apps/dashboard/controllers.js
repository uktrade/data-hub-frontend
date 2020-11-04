const { get } = require('lodash')
const axios = require('axios')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const config = require('../../config')
const { formatHelpCentreAnnouncements } = require('./transformers')

async function renderDashboard(req, res, next) {
  try {
    const userPermissions = get(res, 'locals.user.permissions')

    const helpCentre = config.helpCentre
    let articleFeed

    try {
      const helpCentreArticleFeed = await axios({
        url: config.helpCentre.apiFeed,
        headers: { Authorization: `Bearer ${config.helpCentre.token}` },
        timeout: 1000,
      })
      articleFeed =
        formatHelpCentreAnnouncements(helpCentreArticleFeed.data) || []
    } catch (e) {
      // If we encounter an error when fetching the latest help centre articles,
      // just show an empty feed
      articleFeed = []
    }

    res.title('Dashboard').render('dashboard/views/dashboard', {
      articleFeed,
      interactionsPermitted: isPermittedRoute(
        '/interactions',
        GLOBAL_NAV_ITEMS,
        userPermissions
      ),
      helpCentre,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
