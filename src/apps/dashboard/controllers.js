const { get } = require('lodash')
const rp = require('request-promise')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const { fetchHomepageData, fetchCompanyList } = require('./repos')
const config = require('../../../config')
const { formatHelpCentreAnnouncements, transformCompanyList } = require('./transformers')

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
      next(e)
    }
    const canViewCompanyList = userPermissions.includes(
      'company_list.view_companylistitem'
    )

    const companyList = canViewCompanyList
      ? JSON.stringify(
        transformCompanyList(await fetchCompanyList(req.session.token))
      )
      : null

    res.title('Dashboard').render('dashboard/views/dashboard', {
      companyList,
      contacts,
      interactions,
      articleFeed,
      interactionsPermitted: isPermittedRoute(
        '/interactions',
        GLOBAL_NAV_ITEMS,
        userPermissions
      ),
      canViewCompanyList,
      helpCentre,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
