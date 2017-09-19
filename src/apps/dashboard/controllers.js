const dashboardService = require('./services')

function getHandler (req, res) {
  const days = 15

  dashboardService
    .getHomepageData(req.session.token, days)
    .then((data) => {
      // TODO: Remove manual limit on interactions and contacts once API supports it
      res
        .title('Dashboard')
        .render('dashboard/views/dashboard', {
          totalDays: days,
          interactionsCount: data.interactions.length,
          interactions: data.interactions && data.interactions.length ? data.interactions.slice(0, 5) : [],
          contactsCount: data.contacts.length,
          contacts: data.interactions && data.contacts.length ? data.contacts.slice(0, 5) : [],
        })
    })
}

module.exports = {
  getHandler,
}
