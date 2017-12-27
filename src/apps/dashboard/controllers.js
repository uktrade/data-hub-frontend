const { get } = require('lodash')

const { GLOBAL_NAV_ITEMS } = require('../constants')

const { isPermittedRoute } = require('../middleware')
const { fetchHomepageData } = require('./repos')

async function renderDashboard (req, res, next) {
  try {
    const userPermissions = get(res, 'locals.user.permissions')
    const {
      contacts,
      interactions,
    } = await fetchHomepageData(req.session.token)

    res
      .title('Dashboard')
      .render('dashboard/views/dashboard', {
        contacts,
        interactions,
        interactionsPermitted: isPermittedRoute('/interactions', GLOBAL_NAV_ITEMS, userPermissions),
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
