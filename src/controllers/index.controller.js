const dashboardService = require('../services/dashboard.service')

module.exports = (req, res) => {
  const days = 15

  dashboardService.getHomepageData(req.session.token, days)
    .then((data) => {
      res.render('index', {
        totalDays: days,
        interactions: data.interactions,
        contacts: data.contacts
      })
    })
}
