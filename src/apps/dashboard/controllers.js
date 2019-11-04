const { get } = require('lodash')
const rp = require('request-promise')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const { fetchHomepageData, fetchCompanyLists } = require('./repos')
const config = require('../../config')
const { formatHelpCentreAnnouncements } = require('./transformers')

async function renderDashboard (req, res, next) {
  try {
    const userPermissions = get(res, 'locals.user.permissions')
    const { contacts, interactions } = await fetchHomepageData(
      req.session.token
    )

    const helpCentre = config.helpCentre
    let articleFeed

    try {
      const helpCentreArticleFeed = await rp({
        uri: config.helpCentre.apiFeed,
        auth: {
          'bearer': config.helpCentre.token,
        },
        json: true,
        timeout: 1000,
      })
      articleFeed = formatHelpCentreAnnouncements(helpCentreArticleFeed) || []
    } catch (e) {
      // If we encounter an error when fetching the latest help centre articles,
      // just show an empty feed
      articleFeed = []
    }

    const companyLists = res.locals.features.companies_add_remove_from_lists &&
      userPermissions.includes('company_list.view_companylistitem') &&
      await fetchCompanyLists(req.session.token)

    res.title('Dashboard').render('dashboard/views/dashboard', {
      companyLists,
      contacts,
      interactions,
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
