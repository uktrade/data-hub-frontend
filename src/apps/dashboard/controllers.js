const { get, pick } = require('lodash')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const config = require('../../config')
const request = require('../../lib/request')
const { formatHelpCentreAnnouncements } = require('./transformers')

async function renderDashboard(req, res, next) {
  try {
    const user = res.locals.user
    const userPermissions = get(res, 'locals.user.permissions')

    const helpCentre = config.helpCentre
    let articleFeed

    try {
      const helpCentreArticleFeed = await request({
        url: config.helpCentre.apiFeed,
        headers: { Authorization: `Bearer ${config.helpCentre.token}` },
        params: { test: req.query.test },
        timeout: 1000,
      })
      articleFeed = formatHelpCentreAnnouncements(helpCentreArticleFeed) || []
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
      props: {
        adviser: {
          ...pick(user, ['id', 'name', 'last_login', 'dit_team']),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
