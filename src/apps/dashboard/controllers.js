const { get, pick } = require('lodash')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const config = require('../../config')
const hawkRequest = require('../../lib/axios-hawk-request')
const { formatHelpCentreAnnouncements } = require('./transformers')

const getarticles = (req) => {
  const testParam = req.query.test ? `?test=${req.query.test}` : ''
  const url = `${config.helpCentre.apiFeed}${testParam}`
  return hawkRequest(url, config.hawkCredentials.helpCentre, 1000)
}

async function renderDashboard(req, res, next) {
  try {
    const user = res.locals.user
    const userPermissions = get(res, 'locals.user.permissions')

    const helpCentre = config.helpCentre
    let articleFeed

    try {
      const { articles } = await getarticles(req)
      articleFeed = formatHelpCentreAnnouncements(articles) || []
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
