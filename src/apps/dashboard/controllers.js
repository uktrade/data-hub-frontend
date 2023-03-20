const { get, pick } = require('lodash')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')

async function renderDashboard(req, res, next) {
  try {
    const user = res.locals.user
    const userPermissions = get(res, 'locals.user.permissions')

    res.title('Dashboard').render('dashboard/views/dashboard', {
      interactionsPermitted: isPermittedRoute(
        '/interactions',
        GLOBAL_NAV_ITEMS,
        userPermissions
      ),
      props: {
        adviser: {
          ...pick(user, ['id', 'name', 'last_login', 'dit_team']),
        },
        userPermissions,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
