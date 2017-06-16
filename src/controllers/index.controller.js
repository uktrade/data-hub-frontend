const router = require('express').Router()
const dashboardService = require('../services/dashboard.service')

function getHandler (req, res) {
  const days = 15

  dashboardService.getHomepageData(req.session.token, days)
    .then((data) => {
      res.render('index', {
        title: 'Dashboard',
        totalDays: days,
        interactions: data.interactions,
        contacts: data.contacts,
      })
    })
}

router.get('/', getHandler)

module.exports = { router }
