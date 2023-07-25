const { pick } = require('lodash')

async function renderDashboard(req, res, next) {
  try {
    const user = res.locals.user
    res.title('Dashboard').render('dashboard/views/dashboard', {
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
