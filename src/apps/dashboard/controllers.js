const dashboardService = require('./services')

function getHandler (req, res) {
  const days = 15

  dashboardService
    .getHomepageData(req.session.token, days)
    .then((data) => {
      res
        .title('Dashboard')
        .render('dashboard/views/dashboard', {
          totalDays: days,
          interactions: data.interactions,
          contacts: data.contacts,
        })
    })
}

module.exports = {
  getHandler,
}
