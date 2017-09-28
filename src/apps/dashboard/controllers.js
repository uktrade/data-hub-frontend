const { fetchHomepageData } = require('./repos')

async function renderDashboard (req, res, next) {
  try {
    const {
      contacts,
      interactions,
    } = await fetchHomepageData(req.session.token)

    res
      .title('Dashboard')
      .render('dashboard/views/dashboard', {
        contacts,
        interactions,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
